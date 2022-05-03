const router = require("express").Router();
const { updateVideo } = require("../libs/Datastore")

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


router.put("/:videoId", (req, res) => {
  if (!req.user.admin || req.headers.ADMIN_KEY !== process.env.DEVTUBE_ADMIN_KEY) {
    res.sendStatus(403)
    return;
  }

  const { newVideo, tweet } = req.body;
  updateVideo(newVideo).then(() => res.sendStatus(200)).catch(() => res.sendStatus(500))
});

module.exports = router;
