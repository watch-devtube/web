const asyncHandler = require("express-async-handler");
const router = require("express").Router();
const { searchApprovedVideosForever } = require("../libs/Datastore");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    console.time("rss fetch");
    const videos = await searchApprovedVideosForever();
    console.timeEnd("rss fetch");

    const feedTitle = "Best tech talks for developers";

    const toFeedItem = (video) => ({
      title: video.title,
      id: video.objectID,
      link: `https://dev.tube/video/${video.objectID}`,
      description: `${video.title} by ${video.speakerNames.join(", ")}`,
      image: `https://img.youtube.com/vi/${video.objectID}/hqdefault.jpg`,
    });

    const { Feed } = require("feed");
    const feed = new Feed({
      title: feedTitle,
      description: feedTitle,
      link: "https://dev.tube",
      image: `https://dev.tube/favicon.png`,
    });
    videos.map(toFeedItem).forEach(feed.addItem);

    res.set("Content-Type", "text/xml");
    res.send(feed.rss2());
  })
);

module.exports = router;