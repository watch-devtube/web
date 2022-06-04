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

  const topics = Object.entries(data.topicStats).map(([key, count]) => ({ key, count }));
  topics.sort((a, b) => a.key.localeCompare(b.key))


  const speakers = Object.entries(data.speakerStats).map(([key, count]) => ({ key, count, name: data.speakerNames[key] }))
  speakers.sort((a, b) => a.name.localeCompare(b.key))

  const stats = {
    topics,
    speakers,
    karma: data.karma
  }

  return stats;
}