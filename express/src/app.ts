console.time("Application start");

console.time("Imports");

import * as fs from "fs";
import * as path from "path";
import * as dayjs from "dayjs";

import { LEADERBOARD_TITLE, LEADERBOARD_DESCR } from "./texts";

import "./utils";
import { Fastr } from "devtube-commons";
import { Request, Response } from "express";
import axios from "axios";
import { dnsCache, Logger } from "devtube-commons";
import { Videos } from "./videos";
import { User } from "./api/user";
import { OgImage } from "./ogImage";
import { IndexHtml } from "./indexHtml";
import responseTime from "./responseTime";

console.timeEnd("Imports");

console.time("Init");

// Configuration settings
Logger.enabled = true;

// Configure DNS cache
dnsCache();

// Configure Express application dependencies
let oneHour = 3600000 * 4;
let express = require("express");
let body = require("body-parser");
let mustache = require("mustache-express");
let cors = require("cors");

let app = express();
let devMode = process.env.DEV_MODE === "true" || process.argv[2] === "dev";
let staticDir = path.resolve(devMode ? `../dist` : "./dist");
let dataDir = path.resolve("./data");
let port = process.env.PORT || 8100;

Logger.time("Fastr indexing");
let fastr = new Fastr({ dataDir: dataDir, serialized: true });
Logger.timeEnd("Fastr indexing");

app.use(cors());
app.use(responseTime);
app.use(body.json());

app.use(
  express.static(staticDir, {
    index: false,
    maxAge: oneHour,
  })
);

app.engine("html", mustache());
app.set("port", port);
app.set("view engine", "mustache");
app.set("view cache", !devMode);
app.set("views", path.join(__dirname, staticDir));

console.timeEnd("Init");

Logger.info("---- APPLICATION STARTED ----");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Application logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.timeEnd("Application start");

async function proxy(req: Request, res: Response) {
  let directLink = ["/channel/", "/tag/"].find((it) => req.path.startsWith(it));

  Logger.info(`REQUEST PATH: ${req.path}`);

  if (!req.path || req.path == "/" || req.path == "/find") {
    new IndexHtml().render(req, res);
  } else if (req.path.startsWith("/contributors")) {
    new IndexHtml({
      title: LEADERBOARD_TITLE,
      descr: LEADERBOARD_DESCR,
    }).render(req, res);
  } else if (req.path.startsWith("/@")) {
    let [, speaker] = req.path.split("/@");
    Logger.info(`SPEAKER REQUEST: ${speaker}`);
    let profile = await axios.get(`https://dossier.dev.tube/twt/${speaker}`);
    let profileData = profile.data;
    new IndexHtml({
      title: `${profileData.name} on DevTube: conference talks, videos and tutorials`,
      descr: profileData.info,
      image: new OgImage(speaker, profileData.name, profileData.info).url,
    }).render(req, res);
  } else if (req.path.startsWith("/api/")) {
    let module = await import(`.${req.path}`);
    module.default(req, res, fastr);
  } else if (directLink) {
    let param = req.path.split(directLink)[1];
    Logger.info(`DIRECT LINK REQUEST: ${directLink}`);
    new IndexHtml({
      title: `${param} videos, tutorials, webinars on DevTube`,
      descr: `All videos and tutorials by @${param} are here`,
    }).render(req, res);
  } else if (req.path.startsWith("/video/")) {
    let objectID = req.path.split("/")[2];

    Logger.info(`VIDEO REQUEST: ${objectID}`);

    let q = undefined;
    let sortOrder = ["-satisfaction"];
    let refinement = { objectID: objectID };

    let videoId = fastr
      .search(q, refinement, sortOrder)
      .filter((hit) => hit != null)
      .map((it) => it.objectID)
      .find((it) => true);

    if (!videoId) {
      res.status(404).send("Not found");
      return;
    }

    let videos = new Videos([videoId]);
    let [video] = await videos.fetch();

    if (!video) {
      res.status(404).send("Not found");
    } else {
      let ogImage = `https://img.youtube.com/vi/${video.objectID}/maxresdefault.jpg`;
      let title = `${video.title} – Watch on DevTube`;
      new IndexHtml({
        title: title,
        descr: video.description,
        image: ogImage,
        jsonld: JSON.stringify({
          "@context": "http://schema.org/",
          "@type": "VideoObject",
          "@id": "https://dev.tube/video/" + videoId,
          name: title,
          datePublished: dayjs(video.recordingDate * 1000).format("YYYY-MM-DD"),
          description: video.description,
          thumbnailURL: ogImage,
          thumbnail: ogImage,
          interactionCount: video.views,
          uploadDate: dayjs(video.recordingDate * 1000).format("YYYY-MM-DD"),
          author: video.speaker.map((it) => ({
            "@type": "Person",
            name: it.name,
          })),
        }),
      }).render(req, res);
    }
  } else {
    let absoluteFilePath = path.resolve(`${staticDir}/${req.path}`);
    if (fs.existsSync(absoluteFilePath)) {
      res.sendFile(absoluteFilePath);
    } else {
      Logger.debug(`REQUESTED NOT EXISTING PATH: ${absoluteFilePath}`);
      res.status(404).send("not found");
    }
  }
}

app.get("/api2/lists/all", async (req: Request, res: Response) => {
  res.send({
    tags: fastr.listTags(),
    channels: fastr.listChannels(),
    speakers: fastr.listSpeakers(),
  });
});

app.get("/api2/videos/:videoId", async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const videos = new Videos([videoId]);
  const [video] = await videos.fetch();
  const [reactions] = await videos.reactions();
  res.send({ ...video, reactions });
});

app.post("/api2/videos/:videoId/likes", async (req: Request, res: Response) => {
  let { auth } = req.headers;
  let u = new User(auth);
  let uid = await u.uid();
  let module = await import("./api/reactions");
  module.like(req, res, { uid: uid });
});

app.post(
  "/api2/videos/:videoId/dislikes",
  async (req: Request, res: Response) => {
    let { auth } = req.headers;
    let u = new User(auth);
    let uid = await u.uid();
    let module = await import("./api/reactions");
    module.dislike(req, res, { uid: uid });
  }
);

app.get("*", proxy);
app.post("*", proxy);

if (devMode) {
  let listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

module.exports = app;
