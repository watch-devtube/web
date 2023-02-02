(async () => {
  const { processVideos } = require("./src/libs/Datastore")
  const { begin, each, end } = require("./reindex-impl")
  const { writeFileSync } = require("fs");

  const data = begin();
  const approvedVideos = []
  const mapper = (video) => {
    const newVideo = each(video, data);
    if (newVideo.status === 'approved') {
      approvedVideos.push(newVideo)
    }

  }
  const done = () => {
    const stats = end(data);
    writeFileSync('./data/stats.json', JSON.stringify(stats));
    writeFileSync('./data/videos.json', JSON.stringify(approvedVideos));
  }

  processVideos(mapper, done);
})();


