const Twit = require("twit");
const { adminsOnly } = require("../libs/Middlewares");
const { Youtube } = require("../libs/Youtube");
const asyncHandler = require('express-async-handler')
const router = require("express").Router();
const { random } = require("lodash");

const config = {
  consumer_key: process.env.AUTO_TWT_CONSUMER_KEY || "none",
  consumer_secret: process.env.AUTO_TWT_CONSUMER_SECRET || "none",
  access_token: process.env.AUTO_TWT_ACCESS_TOKEN || "none",
  access_token_secret: process.env.AUTO_TWT_ACCESS_SECRET || "none",
};
const twitter = new Twit(config);


router.post("/", adminsOnly, asyncHandler(async (req, res) => {
  const video = req.body
  const watchingNow = random(5, 50);
  const comments = await new Youtube(process.env.YOUTUBE_API_KEY).fetchCommentCount(video.objectID);
  await tweetTrending(video, watchingNow, comments);
  res.sendStatus(200);
}))

async function tweetTrending(video, watchingNow, comments) {
  if (!video?.objectID) {
    throw new Error("No video to tweet");
  }
  if (!watchingNow) {
    throw new Error("Zero or no people watching.")
  }
  if (!comments) {
    throw new Error("Zero or no people commented.")
  }

  const status = [
    ...[
      `@${video.speakerTwitters[0]}:`,
      `📈 Your talk "${video.title}" is trending on DevTube:`,
      `❤️ ${video.likes} likes`,
      `✍️ ${comments} comments `,
      `📺 ${watchingNow} watching now`,
      "",
      `> https://dev.tube/video/${video.objectID}`,
    ],
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return twitter
    .post("statuses/update", { status })
    .catch((e) =>
      console.error(new Error(`Tweeting of ${video.objectID} failed: ${e}`))
    );
};

module.exports = router;
module.exports.tweetTrending = tweetTrending