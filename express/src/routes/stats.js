const router = require("express").Router();
const { readFile } = require("fs/promises");
const memoize = require("memoizee");

const readStats = () => readFile('./data/stats.json', { encoding: "utf8" }).then(txt => JSON.parse(txt));
const memoizedStats = memoize(readStats, { promise: true });


router.get("/", (_req, res) => {
  memoizedStats()
    .then(stats => res.json(stats))
    .catch(() => res.status(500).send("Something went wrong"))
});

module.exports = router;
