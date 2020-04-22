const router = require("express").Router();

import { Videos } from "../videos";
import { User } from "../user";

router.post("/likes/:videoId", (req, res) => {
  const { videoId } = req.params;
  const { auth } = req.headers;

  const u = new User(auth);
  const videos = new Videos([videoId]);
  u.uid()
    .then(uid => videos.putALike(uid))
    .then(it => res.json(it))
    .catch(e => res.status(500).send(e));
});

router.post("/dislikes/:videoId", (req, res) => {
  const { videoId } = req.params;
  const { auth } = req.headers;

  const u = new User(auth);
  const videos = new Videos([videoId]);
  u.uid()
    .then(uid => videos.putADislike(uid))
    .then(it => res.json(it))
    .catch(e => res.status(500).send(e));
});

module.exports = router;
