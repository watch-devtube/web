const router = require("express").Router();

import { User, firestore } from "../user";

router.get("/", (req, res) => {
  const { auth } = req.headers;
  const u = new User(auth);
  u.uid()
    .then(uid =>
      firestore
        .collection("videos")
        .doc(uid)
        .get()
        .then(snapshot => snapshot.data())
    )
    .then(ok => res.send(ok))
    .catch(nok => res.status(400).send(nok));
});

router.post("/", (req, res) => {
  const { auth } = req.headers;
  const { subscriptions, favorites, watched } = req.body;
  const u = new User(auth);
  u.uid()
    .then(uid =>
      firestore
        .collection("videos")
        .doc(uid)
        .set({
          subscriptions,
          favorites,
          watched
        })
    )
    .then(ok => res.send(ok))
    .catch(nok => res.status(400).send(nok));
});

module.exports = router;
