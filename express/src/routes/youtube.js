const asyncHandler = require('express-async-handler')
const router = require("express").Router();
const { authenticated } = require("../libs/Middlewares")
const { oneVideo } = require('../libs/Datastore');
const { Youtube } = require("../libs/Youtube")

function userAuth(req) {
  const { google } = require('googleapis');
  const oauthClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "");
  oauthClient.setCredentials(req.user.google)
  return oauthClient;
}

router.get("/:commentId/replies", asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const replies = await new Youtube(process.env.YOUTUBE_API_KEY).fetchReplies(commentId);
  res.json(replies);
}));

router.post("/:commentId/replies", authenticated, asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const newReply = await new Youtube(userAuth(req)).replyToComment(commentId, text);
  res.json(newReply);
}));

router.get("/:videoId/comments", asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const pageToken = req.query.nextPageToken;
  const comments = await new Youtube(process.env.YOUTUBE_API_KEY).fetchComments(videoId, pageToken);
  res.json(comments);
}));

router.post("/:videoId/comments", authenticated, asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { text } = req.body;
  const newComment = await new Youtube(userAuth(req)).addComment(videoId, text);
  res.json(newComment)
}));


router.get("/:videoId", authenticated, asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (await oneVideo(videoId)) {
    res.send({ error: "Video already added." });
    return;
  }

  const { video, error } = await new Youtube(process.env.YOUTUBE_API_KEY).fetchVideo(videoId);
  if (error) {
    res.send({ error });
    return
  }

  res.send({ ...video, contributor: req.user.username });

}));

module.exports = router;
