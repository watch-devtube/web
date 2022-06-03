const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();
const jsonDiff = require("json-diff");
const memoize = require("memoizee");

const processVideos = (mapper = (data) => data, done = () => { }) => {
  let changed = 0;
  let processed = 0;
  datastore
    .runQueryStream(datastore.createQuery("videos").filter("status", "approved"))
    .on("error", console.error)
    .on("data", (data) => {
      const key = data[datastore.KEY];
      const copy = { ...data };
      mapper(copy);
      const diff = jsonDiff.diffString(data, copy);
      if (diff) {
        datastore.update({ key, data: copy });
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
  const key = datastore.key(["videos", videoID])
  const [video] = await datastore.get(key);
  return video;
}

const deleteVideo = async (videoID) => {
  const key = datastore.key(["videos", videoID])
  return datastore.delete(key);
}

const updateVideo = async (videoID, mutate) => {
  const key = datastore.key(["videos", videoID])
  const [video] = await datastore.get(key);

  const newVideo = { ...video }
  mutate(newVideo);
  const diff = jsonDiff.diffString(video, newVideo);
  console.log(diff)
  return datastore.update({ key, data: newVideo })
}

const processWeekPicks = async (mutate) => {
  const query = datastore.createQuery("videos").select('__key__');
  const [items] = await datastore.runQuery(query);
  const videoIds = items.map(it => it[datastore.KEY].name)

  const key = datastore.key(["weekly", "WEEK_PICKS"])
  const [item] = await datastore.get(key)
  const newPicks = mutate(item?.picks || [], videoIds)
  return datastore.save({ key, data: { picks: newPicks } })
}

const weekPick = async () => {
  const key = datastore.key(["weekly", "WEEK_PICKS"])
  const [item] = await datastore.get(key)
  if (!item) {
    throw 'No week pick found.'
  }

  const [weekPick] = item.picks
  return weekPick
}

const weekPickForever = memoize(weekPick, { promise: true });

const replaceVideo = async (newVideo) => {
  const key = datastore.key(["videos", newVideo.objectID])
  const [video] = await datastore.get(key);
  const diff = jsonDiff.diffString(video, newVideo);
  console.log(diff)
  return datastore.update({ key, data: newVideo })
}

const createVideo = async (newVideo) => {
  const key = datastore.key(["videos", newVideo.objectID])
  return datastore.insert({ key, data: newVideo })
}

const searchApprovedVideos = () => {
  const q = datastore.createQuery("videos").filter("status", "approved");
  return datastore.runQuery(q);
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
module.exports.datastore = datastore;