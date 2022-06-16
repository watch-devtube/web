const asyncHandler = require("express-async-handler");
const router = require("express").Router();
const { oneVideo } = require("../libs/Datastore");
const { Youtube } = require("../libs/Youtube");

router.get(
  "/:videoId",
  asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
      res.sendStatus(500)
      return;
    }

    const watchingNow = random(5, 50);
    const comments = await new Youtube(process.env.YOUTUBE_API_KEY).fetchCommentCount(videoId);

    const video = await oneVideo(videoId);
    const ogLink = ogImage(video, watchingNow, comments)

    const markup = `<html>
    <head>
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@watchdevtube">
      <meta name="twitter:creator" content="@watchdevtube">
      <meta name="twitter:title" content="${video.title}">
      <meta name="twitter:description" content="A tech talk by ${video.speakerNames[0]}">
      <meta name="twitter:image" content="${ogLink}">
    </head>
    <body>
    </body>
  </html>`;
    res.send(markup)

  })
);



function ogImage(video, watchingNow, comments) {
  const imageDomain = "https://res.cloudinary.com/eduardsi/image/upload";
  const imageTemplate = 'devtube_card_whhycj'

  const image =
    imageDomain +
    "/w_1000,c_fit,co_white,l_text:Lato_60_bold:" + doubleEscape(video.title) + ",g_north_west,x_100,y_100" +
    "/w_1000,c_fit,co_white,l_text:Lato_30:" + kilo(video.likes) + " likes" + ",g_north_west,x_140,y_332" +
    "/w_1000,c_fit,co_white,l_text:Lato_30:" + kilo(watchingNow) + " watching now" + ",g_north_west,x_428,y_332" +
    "/w_1000,c_fit,co_white,l_text:Lato_30:" + kilo(comments) + " comments" + ",g_north_west,x_855,y_332" +
    "/w_1000,c_fit,co_white,l_text:Lato_40_bold:" + video.speakerNames[0] + ",g_north_west,x_240,y_539" +
    "/w_1000,c_fit,co_grey,l_text:Lato_30_bold:" + "@" + video.speakerTwitters[0] + ",g_north_west,x_240,y_587" +
    "/l_twitter_name:" + video.speakerTwitters[0] + ".png,w_96,r_max,g_north_west,x_100,y_515,bo_5px_solid_white" +
    "/" +
    imageTemplate;
  return image;
}

function doubleEscape(txt) {
  return encodeURIComponent(encodeURIComponent(txt));
}

function kilo(num) {
  return num < 1000 ? num : Math.floor(num / 1000) + "K"
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;