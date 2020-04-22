const router = require("express").Router();

const fastr = require("../fastr");

router.get("/", (req, res) => {
  res.send({
    tags: fastr.listTags(),
    channels: fastr.listChannels(),
    speakers: fastr.listSpeakers()
  });
});

module.exports = router;
