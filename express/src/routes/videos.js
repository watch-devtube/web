const router = require("express").Router();
const { Videos } = require("../videos");

router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;
  const videos = new Videos([videoId]);

  videos.fetch().then(([video]) => {
    if (!video) {
      throw `Video with ID ${video} doesn't exist`;
    } else {
      res.send({ ...video });
    }
  }).catch(error => res.status(500).send(error));
});

module.exports = router;
