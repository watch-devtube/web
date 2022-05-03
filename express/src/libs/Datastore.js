const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();
const jsonDiff = require("json-diff");

const processVideos = (mapper = (data) => data, done = () => { }) => {
  let changed = 0;
  datastore
    .runQueryStream(datastore.createQuery("video").filter("status", "approved"))
    .on("error", console.error)
    .on("data", (data) => {
      console.log(data)
      const key = data[datastore.KEY];
      const copy = { ...data };
      mapper(copy);
      const diff = jsonDiff.diffString(data, copy);
      if (diff) {
        datastore.update({ key, data: copy });
        changed++;
        console.log(diff);
      }
    })
    .on("end", () => {
      console.log(`Processing has completed. ${changed} entities updated.`)
      done()
    }
    );
};

module.exports.processVideos = processVideos;
module.exports.datastore = datastore;