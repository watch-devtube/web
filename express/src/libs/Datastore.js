const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();
const jsonDiff = require("json-diff");

const processVideos = (mapper = (data) => data, done = () => { }) => {
  let changed = 0;
  let processed = 0;
  datastore
    .runQueryStream(datastore.createQuery("video").filter("status", "approved"))
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

const updateVideo = (video) => {
  const key = datastore.key(["video", video.objectID])
  return datastore.update({ key, data: video })
}

module.exports.processVideos = processVideos;
module.exports.updateVideo = updateVideo;
module.exports.datastore = datastore;