const router = require("express").Router();
import { Videos } from "../videos";

router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;
  const videos = new Videos([videoId]);

  Promise.all([videos.fetch(), videos.reactions()])
    .then(([[video], [reactions]]) => {
      if (!video) {
        throw `Video with ID ${video} doesn't exist`;
      } else {
        res.send({ ...video, reactions });
      }
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
