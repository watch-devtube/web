(async () => {
  const { processVideos } = require("./src/libs/Datastore")
  const { begin, each, end } = require("./reindex-impl")
  const { writeFileSync } = require("fs");

  const data = begin();
  const mapper = (video) => each(video, data)
  const done = () => {
    const stats = end(data);
    writeFileSync('./data/stats.json', JSON.stringify(stats));
  }

  processVideos(mapper, done);
})();


