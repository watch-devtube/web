const memoize = require('memoizee');
const { readFileSync } = require("fs");

const readStats = () => JSON.parse(readFileSync('./data/stats.json', { encoding: "utf8" }));
const statsForever = memoize(readStats, { promise: true });

module.exports.statsForever = statsForever