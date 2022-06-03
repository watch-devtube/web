const asyncHandler = require('express-async-handler')
const router = require("express").Router();
const { authenticated, adminsOnly } = require("../libs/Middlewares");
const { updateVideo, createVideo, oneVideo, replaceVideo, deleteVideo } = require("../libs/Datastore")
const memoize = require("memoizee");
const Joi = require("joi")

const videoSchema = memoize(() => {
  const schema = Joi.object().keys({
    objectID: Joi.string().required(),
    title: Joi.string().required(),
    channelId: Joi.string().required(),
    channelTitle: Joi.string().required(),
    contributor: Joi.string().required(),
    likes: Joi.number().required(),
    duration: Joi.string().isoDuration().required(),
    recordingDate: Joi.date().iso().required(),
    submissionDate: Joi.date().iso().required(),
    status: Joi.string().valid("approved", "submitted").required(),
    speakerNames: Joi.array().min(1).required(),
    speakerTwitters: Joi.array().min(1).required(),
    topics: Joi.array().min(1).required(),
    series: Joi.array()
  })
  return schema;
})

router.get("/:videoId", asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await oneVideo(videoId);
  if (!video) {
    res.sendStatus(404)
  }
  res.json(video);
}));

router.delete("/:videoId", adminsOnly, asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  await deleteVideo(videoId);
  res.sendStatus(200);
}))

router.post("/:videoId/like", authenticated, asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  await updateVideo(videoId, (video) => {
    video.likes++
    res.send("" + video.likes)
  })

}))

router.post("/", authenticated, asyncHandler(async (req, res) => {
  const status = req.user.admin ? "approved" : "submitted"
  const video = Joi.attempt({ ...req.body, status }, videoSchema());
  await createVideo(video);
  res.sendStatus(200)
}))

router.put("/", adminsOnly, asyncHandler(async (req, res) => {
  const video = Joi.attempt(req.body, videoSchema());
  await replaceVideo(video);
  res.sendStatus(200);
}))

module.exports = router;
