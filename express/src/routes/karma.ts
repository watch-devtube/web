const router = require("express").Router();

import axios from "axios";

router.get("/", (req, res) => {
  const { user } = req.query;
  if (!user) {
    res.json({ karma: 0 });
    return;
  }

  const [provider, email, uid] = Buffer.from(user, "base64")
    .toString()
    .split("/");
  if (!provider || !email || !uid) {
    res.json({ karma: 0 });
    return;
  }

  const uidOf = contributor => {
    const [, uid] = contributor.avatar.match(
      /githubusercontent.com\/u\/(\d+).*$/
    );
    return uid;
  };

  const myKarma = contributors => {
    const contributor = contributors.find(
      each => each.email === email || uidOf(each) === uid
    );
    return contributor ? contributor.karma : 0;
  };

  const myAxios = axios.create({ timeout: 3000 });
  myAxios
    .get("https://storage.googleapis.com/dev-tube-index/board.json")
    .then(response => res.json({ karma: myKarma(response.data.contributors) }))
    .catch(() => res.json({ karma: 0 }));
});

module.exports = router;
