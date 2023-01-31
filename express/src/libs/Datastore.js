const jsonDiff = require("json-diff");
const memoize = require("memoizee");

const datastoreForever = memoize(() => {
  const { Datastore } = require("@google-cloud/datastore");
  const datastore = new Datastore();
  return datastore;
})

const processVideos = (mapper = (data) => data, done = () => { }) => {
  let changed = 0;
  let processed = 0;
  datastoreForever()
    .runQueryStream(datastoreForever().createQuery("videos").filter("status", "approved"))
    .on("error", console.error)
    .on("data", (data) => {
      const key = data[datastoreForever().KEY];
      const copy = { ...data };
      mapper(copy);
      const diff = jsonDiff.diffString(data, copy);
      if (diff) {
        datastoreForever().update({ key, data: copy });
        changed++;
        console.log(diff);
      }
      processed++
    })
    .on("end", () => {
      console.log(`Processing has completed. ${processed} entities processed. ${changed} updated.`)
      done()
    }
    );
};

const oneVideo = async (videoID) => {
  const key = datastoreForever().key(["videos", videoID])
  const [video] = await datastoreForever().get(key);
  return video;
}

const deleteVideo = async (videoID) => {
  const key = datastoreForever().key(["videos", videoID])
  return datastoreForever().delete(key);
}

const updateVideo = async (videoID, mutate) => {
  const key = datastoreForever().key(["videos", videoID])
  const [video] = await datastoreForever().get(key);

  const newVideo = { ...video }
  mutate(newVideo);
  const diff = jsonDiff.diffString(video, newVideo);
  console.log(diff)
  return datastoreForever().update({ key, data: newVideo })
}

const processWeekPicks = async (mutate) => {
  const query = datastoreForever().createQuery("videos").filter('status', 'approved').select('__key__');
  const [items] = await datastoreForever().runQuery(query);
  const videoIds = items.map(it => it[datastoreForever().KEY].name)

  const key = datastoreForever().key(["weekly", "WEEK_PICKS"])
  const [item] = await datastoreForever().get(key)
  const newPicks = mutate(item?.picks || [], videoIds)
  return datastoreForever().save({ key, data: { picks: newPicks } })
}

const weekPick = async () => {
  const key = datastoreForever().key(["weekly", "WEEK_PICKS"])
  const [item] = await datastoreForever().get(key)
  if (!item) {
    throw 'No week pick found.'
  }

  const [weekPick] = item.picks
  return weekPick
}

const weekPickForever = memoize(weekPick, { promise: true });

const replaceVideo = async (newVideo) => {
  const key = datastoreForever().key(["videos", newVideo.objectID])
  const [video] = await datastoreForever().get(key);
  const diff = jsonDiff.diffString(video, newVideo);
  console.log(diff)
  return datastoreForever().update({ key, data: newVideo })
}

const createVideo = async (newVideo) => {
  const key = datastoreForever().key(["videos", newVideo.objectID])
  return datastoreForever().insert({ key, data: newVideo })
}

const searchApprovedVideos = () => {
  const q = datastoreForever().createQuery("videos").filter("status", "approved");
  return datastoreForever().runQuery(q);
}

const searchApprovedVideosForever = memoize(searchApprovedVideos, { promise: true })

module.exports.weekPickForever = weekPickForever;
module.exports.processWeekPicks = processWeekPicks;
module.exports.processVideos = processVideos;
module.exports.oneVideo = oneVideo;
module.exports.updateVideo = updateVideo;
module.exports.createVideo = createVideo;
module.exports.replaceVideo = replaceVideo;
module.exports.deleteVideo = deleteVideo;
module.exports.searchApprovedVideos = searchApprovedVideos;
module.exports.searchApprovedVideosForever = searchApprovedVideosForever;
module.exports.datastoreForever = datastoreForever;