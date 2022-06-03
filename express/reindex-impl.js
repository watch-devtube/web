const { chain } = require("lodash");

module.exports.begin = () => {
  const data = {
    speakerStats: {},
    speakerNames: {},
    topicStats: {},
    karma: {}
  }
  return data;
}

module.exports.each = (video, data) => {

  data.videoIds.push(video.objectID)

  data.karma[video.contributor] = (data.karma[video.contributor] || 0) + (video.likes || 1)
  video.speakerTwitters.forEach((twitter, index) => {
    data.speakerStats[twitter] = (data.speakerStats[twitter] || 0) + 1
    data.speakerNames[twitter] = video.speakerNames[index]
  })

  video.topics.forEach(topic => {
    data.topicStats[topic] = (data.topicStats[topic] || 0) + 1
  })

  return video;
};

module.exports.end = (data) => {
  const stats = {
    topics: chain(data.topicStats)
      .entries()
      .map(([key, count]) => ({ key, count }))
      .orderBy('key', 'asc')
      .value(),
    speakers: chain(data.speakerStats)
      .entries()
      .map(([key, count]) => ({ key, count, name: data.speakerNames[key] }))
      .orderBy('name', 'asc')
      .value(),
    karma: data.karma
  }

  return stats;
}