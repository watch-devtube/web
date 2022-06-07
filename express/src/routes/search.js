const asyncHandler = require('express-async-handler')
const { datastoreForever, weekPickForever, oneVideo } = require("../libs/Datastore");
const { authenticated } = require('../libs/Middlewares');
const router = require("express").Router();

const NOTHING_FOUND = `¯\\_(ツ)_/¯ No talks matching your criteria`

router.post("/", asyncHandler(async (req, res) => {
  const { p, s } = req.body;

  const q = datastoreForever().createQuery("videos");
  if (!req.user?.admin) {
    q.filter("status", "approved")
  }
  const { videos, more } = await paginate(q, p, s);

  const { video } = await weekPickForever();
  const weekPick = await oneVideo(video);

  res.json({
    videos,
    more,
    weekPick
  })
}));

router.post("/@:speaker", asyncHandler(async (req, res) => {
  const { speaker } = req.params;
  const { p, s } = req.body;

  const q = datastoreForever().createQuery("videos").filter("speakerTwitters", speaker).filter("status", "approved");

  const { videos, more } = await paginate(q, p, s);

  const speakerIndex = videos[0]?.speakerTwitters.indexOf(speaker)
  const whois = videos[0]?.speakerNames[speakerIndex];
  res.json({
    videos,
    more,
    speakerIndex,
    title: videos.length ? `The best tech talks by ${whois}` : NOTHING_FOUND
  })
}));

router.post("/~:topic*", asyncHandler(async (req, res) => {
  const { topic } = req.params;
  const { p, s } = req.body;
  const q = datastoreForever().createQuery("videos").filter("topics", topic).filter("status", "approved");
  const { videos, more } = await paginate(q, p, s);
  res.json({
    videos,
    more,
    title: videos.length ? `The best tech talks about ${topic}` : NOTHING_FOUND
  })
}));

router.post("/:list(later|watched|favorites)", authenticated, asyncHandler(async (req, res) => {
  const list = req.params.list;
  const tx = datastoreForever().transaction();
  const [lists] = await tx.get(datastoreForever().key(['user', req.user.email]));
  if (!lists || !lists[list] || !lists[list].length) {
    res.json({})
    return
  }
  const videoIds = lists[list];

  const keys = videoIds.map(id => datastoreForever().key(["videos", id]));
  const [matches] = await tx.get(keys);
  matches.sort(match => -videoIds.indexOf(match.objectID))
  const videos = matches;

  const titles = {
    later: `Tech talks to watch later (${matches.length})`,
    watched: `Tech talks I watched (${matches.length})`,
    favorites: `My favorite tech talks (${matches.length})`
  }

  res.json({
    videos,
    title: titles[list]
  })
}));

async function paginate(q, p, s) {
  if (p) {
    q.start(p);
  }
  if (s === 'likes') {
    q.order('likes', { descending: true })
  }
  if (s === 'recent') {
    q.order('submissionDate', { descending: true })
  }

  const [videos, info] = await datastoreForever().runQuery(q.limit(30));
  const more = info.moreResults !== datastoreForever().NO_MORE_RESULTS ? info.endCursor : ""
  return {
    videos,
    more
  }
}

module.exports = router;
