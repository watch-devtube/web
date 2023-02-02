const asyncHandler = require('express-async-handler')
const { datastoreForever, searchApprovedVideosForever, searchAllVideos } = require("../libs/Datastore");
const { authenticated } = require('../libs/Middlewares');
const router = require("express").Router();
const _ = require("lodash");

const NOTHING_FOUND = `¯\\_(ツ)_/¯ No talks matching your criteria`

router.post("/", asyncHandler(async (req, res) => {
  const { p, s } = req.body;

  const search = req.user?.admin ? searchAllVideos : searchApprovedVideosForever
  const foundItems = await search();
  const { videos, more } = await paginate(foundItems, p, s);

  res.json({
    videos,
    more
  })
}));

router.post("/@:speaker", asyncHandler(async (req, res) => {
  const { speaker } = req.params;
  const { p, s } = req.body;

  const foundItems = await searchApprovedVideosForever()
  const someItems = foundItems.filter(it => it.speakerTwitters.includes(speaker))

  const { videos, more } = await paginate(someItems, p, s);

  const speakerIndex = videos[0]?.speakerTwitters.indexOf(speaker)
  const whois = videos[0]?.speakerNames[speakerIndex];
  res.json({
    videos,
    more,
    speakerIndex,
    title: videos.length ? `The best tech talks by ${whois}` : NOTHING_FOUND
  })
}));

router.post("/~:topic(*)", asyncHandler(async (req, res) => {
  const { topic } = req.params;
  const { p, s } = req.body;

  const foundItems = await searchApprovedVideosForever()
  const someItems = foundItems.filter(it => it.topics.includes(topic))

  const { videos, more } = await paginate(someItems, p, s);
  res.json({
    videos,
    more,
    title: videos.length ? `The best ${topic} talks` : NOTHING_FOUND
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

async function paginate(items, p, s) {
  const pg = Number(p) || 1;
  const pgSize = 30;
  const pgTotal = Math.ceil(items.length / pgSize);
  const offset = (pg - 1) * pgSize;
  const more = pgTotal === pg ? "" : pg + 1

  let sortedItems = items
  if (s === 'likes') {
    sortedItems = _.orderBy(items, ['likes'], ['desc'])
  }
  if (s === 'recent') {
    sortedItems = _.orderBy(items, ['submissionDate'], ['desc'])
  }

  const videos = _.drop(sortedItems, offset).slice(0, pgSize);
  return {
    videos,
    more
  }
}

module.exports = router;
