const { processVideos } = require("./src/libs/Datastore")
const { chain } = require("lodash");
const { writeFileSync } = require("fs")

const speakerStats = {}
const topicStats = {}


const mapper = (video) => {

  const speaker = video.speaker.twitter;
  const topics = video.tags;

  speakerStats[speaker] = (speakerStats[speaker] || 0) + 1

  topics.forEach(topic => { topicStats[topic] = (topicStats[topic] || 0) + 1 })

  return video;
};


const done = () => {
  const stats = {
    topics: chain(topicStats)
      .entries()
      .map(([topic, count]) => ({ topic, count }))
      .orderBy('count', 'desc')
      .value(),
    speakers: chain(speakerStats)
      .entries()
      .map(([topic, count]) => ({ topic, count }))
      .orderBy('count', 'desc')
      .value()
  }

  console.log(stats)

  writeFileSync('./data/stats.json', JSON.stringify(stats));
}

processVideos(mapper, done);
