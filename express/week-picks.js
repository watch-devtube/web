const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const excludedVideos = [
  "JoTB2mcjU7w", // TDD part 2
  "YNw4baDz6WA", // TDD part 3
  "dGtasFJnUxI", // TDD part 4
  "gWD6REVeKW4"  // TDD part 5
]

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function determineWeekPicks(weekPicks, allVideoIds, randomVideo = sample, now = dayjs.utc()) {
  const [weekPick] = weekPicks;
  const shouldLeaveWeekPicksIntact = weekPick && dayjs(weekPick.expires).isAfter(now);
  if (shouldLeaveWeekPicksIntact) {
    return weekPicks
  } else {
    const videosButExcluded = allVideoIds.filter(videoId => !excludedVideos.includes(videoId))
    const videosNeverPickedBefore = videosButExcluded.filter(videoId => !weekPicks.map(pick => pick.video).includes(videoId))
    const someVideo = randomVideo(videosNeverPickedBefore)
    if (!someVideo) {
      throw "No videos to pick the weekly video from"
    }
    const endOfWeek = dayjs.utc().endOf('week').toDate()
    const pickedVideo = {
      expires: endOfWeek,
      video: someVideo
    }
    return [pickedVideo, ...weekPicks]
  }
}

module.exports.determineWeekPicks = determineWeekPicks;

