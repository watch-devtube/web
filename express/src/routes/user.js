const router = require("express").Router();

const { authenticated } = require("../libs/Middlewares");
const { datastoreForever } = require("../libs/Datastore")

router.get("/bootstrap", async (req, res) => {

  if (!req.user) {
    res.json({})
    return;
  }

  const userKey = req.user.email
  try {
    const [user] = await datastoreForever().get(datastoreForever().key(['user', userKey]));
    res.json(user)
  } catch (err) {
    console.log(err);
    res.sendStatus(500)
  }
})

router.post("/weekly-subscription", authenticated, async (req, res) => {
  const userKey = req.user.email
  try {
    const key = datastoreForever().key(['user', userKey]);
    const tx = datastoreForever().transaction();

    const [user] = await tx.get(key);
    const data = user || {
      later: [],
      favorites: [],
      watched: [],
    }

    data.subscribedToWeekly = true;

    tx.upsert({ key, data });
    await tx.commit();

    res.json(data)
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
})

router.delete("/weekly-subscription", authenticated, async (req, res) => {
  const userKey = req.user.email
  try {
    const key = datastoreForever().key(['user', userKey]);
    const tx = datastoreForever().transaction();
    const [user] = await tx.get(key);
    user.subscribedToWeekly = false
    tx.upsert({ key, data: user });
    await tx.commit();
    res.json(user)
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
})

router.delete("/lists/:list/:videoId", authenticated, async (req, res) => {
  const userKey = req.user.email
  const { list, videoId } = req.params
  if (!list || !videoId || !userKey) {
    res.sendStatus(500)
    return;
  }

  const key = datastoreForever().key(['user', userKey])

  try {
    const tx = datastoreForever().transaction();
    const [data] = await tx.get(key);


    const index = data[list].indexOf(videoId);
    if (index != -1) {
      data[list].splice(index, 1);
      tx.upsert({ key, data });
      await tx.commit();
    }

    res.json(data[list])
  } catch {
    res.sendStatus(500);
  }

})

router.post("/lists/:list/:videoId", authenticated, async (req, res) => {
  const { list, videoId } = req.params
  if (!list || !videoId) {
    res.sendStatus(500)
    return;
  }

  const userKey = req.user.email

  try {
    const key = datastoreForever().key(['user', userKey]);
    const tx = datastoreForever().transaction();

    const [user] = await tx.get(key);
    const data = user || {
      later: [],
      favorites: [],
      watched: []
    }

    if (!data[list].includes(videoId)) {
      data[list].push(videoId);
      tx.upsert({ key, data });
      await tx.commit();
    }

    res.json(data[list])
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
