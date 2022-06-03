console.time("initializing sitemap");
const asyncHandler = require("express-async-handler");
const router = require("express").Router();
const { searchApprovedVideosForever } = require("../libs/Datastore");
console.timeEnd("initializing sitemap");

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { SitemapStream } = require("sitemap");
    const { createGzip } = require("zlib");

    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    const links = new Set();

    const [videos] = await searchApprovedVideosForever();

    videos.forEach((video) => {
      links.add("/video/" + video.objectID);
      video.topics.forEach((topic) => {
        links.add("/~" + encodeURIComponent(topic));
      });
      video.speakerTwitters.forEach((speaker) => {
        links.add("/@" + speaker);
      });
    });

    try {
      const stream = new SitemapStream({ hostname: "https://dev.tube/" });
      const pipeline = stream.pipe(createGzip());
      links.forEach((link) => stream.write({ url: link, changefreq: "daily" }));
      stream.end();
      pipeline.pipe(res).on("error", (e) => {
        throw e;
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  })
);

module.exports = router;