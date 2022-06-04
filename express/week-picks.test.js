const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
const { determineWeekPicks } = require("./week-picks")

const videoIds = ['AAA', 'BBB', 'CCC']

const expires = dayjs.utc().endOf('week');
const minuteBeforeExpiration = expires.subtract(1, 'm').toDate()
const minuteAfterExpiration = expires.add(1, 'm').toDate()

function first(items) {
  return items[0];
}

function last(items) {
  return items[items.length - 1];
}

test('picks a random weekly video with expiration at the end of the week', () => {
  const random = first;
  const [actualWeekPick] = determineWeekPicks([], videoIds, random)
  const expectedWeekPick = { expires: expires.toDate(), video: random(videoIds) }
  expect(actualWeekPick).toEqual(expectedWeekPick)
});

test('keeps weekly pick until expiration', () => {
  const nonExpiredVideo = { expires: expires.toDate(), video: 'AAA' }
  const random = last
  const now = minuteBeforeExpiration
  const [actualWeekPick] = determineWeekPicks([nonExpiredVideo], videoIds, random, now)
  expect(actualWeekPick).toEqual(nonExpiredVideo)
});

test('rolls weekly video after expiration', () => {
  const expiredWeekPick = { expires: expires.toDate(), video: 'AAA' }
  const random = last
  const now = minuteAfterExpiration
  const weekPicks = determineWeekPicks([expiredWeekPick], videoIds, random, now)
  const expectedWeekPick = { expires: expires.toDate(), video: random(videoIds) }
  expect(weekPicks).toEqual([expectedWeekPick, expiredWeekPick])
});

test('throws if there are no videos to pick the weekly from', () => {
  const expiredWeekPick = { expires: expires.toDate(), video: 'AAA' }
  const random = last
  const now = minuteAfterExpiration
  expect(() => determineWeekPicks([expiredWeekPick], ['AAA'], random, now)).toThrow("No videos to pick the weekly video from");
});

test('never picks the same video', () => {
  const expiredWeekPick = { expires: expires.toDate(), video: 'AAA' }
  const oldWeekPick = { expires: expires.toDate(), video: 'CCC' }
  const random = last
  const now = minuteAfterExpiration
  const weekPicks = determineWeekPicks([expiredWeekPick, oldWeekPick], videoIds, random, now)
  const expectedWeekPick = { expires: expires.toDate(), video: 'BBB' }
  expect(weekPicks).toEqual([expectedWeekPick, expiredWeekPick, oldWeekPick])
});