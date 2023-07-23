const asyncHandler = require("express-async-handler");
const router = require("express").Router();
const { oneVideo } = require("../libs/Datastore");

router.get(
  "/:videoId",
  asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
      res.sendStatus(500)
      return;
    }

    const video = await oneVideo(videoId);
    const ogLink = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    const markup = `<html>
    <head>
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@watchdevtube">
      <meta name="twitter:creator" content="@watchdevtube">
      <meta name="twitter:title" content="${video.title}">
      <meta name="twitter:description" content="A tech talk by ${video.speakerNames[0]}">
      <meta name="twitter:image" content="${ogLink}">
      <meta property="og:image" content="${ogLink}">
      <meta property="og:title" content="${video.title}">
      <meta property="og:description" content="A tech talk by ${video.speakerNames[0]}">
    </head>
    <body>
    </body>
  </html>`;
    res.send(markup)

  })
);

module.exports = router;
