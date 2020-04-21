console.time("Application start");

console.time("Imports");

import * as fs from "fs";
import * as path from "path";

import "./utils";
import { Fastr } from "devtube-commons";
import { Request, Response } from "express";
import { dnsCache, Logger } from "devtube-commons";
import { Videos } from "./videos";
import { User } from "./api/user";

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
let cors = require("cors");

let winston = require("winston");
let expressWinston = require("express-winston");

let app = express();
let devMode = process.env.DEV_MODE === "true" || process.argv[2] === "dev";
let staticDir = path.resolve(devMode ? `../dist` : "./dist");
let dataDir = path.resolve("./data");
let port = process.env.PORT || 8100;

Logger.time("Fastr indexing");
let fastr = new Fastr({ dataDir: dataDir, serialized: true });
Logger.timeEnd("Fastr indexing");

app.use(cors());
app.use(body.json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false,
    expressFormat: true,
  })
);
app.use(require("prerender-node"));

app.use(
  express.static(staticDir, {
    index: false,
    maxAge: oneHour,
  })
);

app.set("port", port);
app.set("view cache", !devMode);
app.set("views", path.join(__dirname, staticDir));

console.timeEnd("Init");

Logger.info("---- APPLICATION STARTED ----");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Application logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.timeEnd("Application start");

async function proxy(req: Request, res: Response) {
  if (
    !req.path ||
    req.path == "/" ||
    req.path == "/find" ||
    req.path.startsWith("/contributors") ||
    req.path.startsWith("/@") ||
    req.path.startsWith("/channel/") ||
    req.path.startsWith("/tag/") ||
    req.path.startsWith("/video/")
  ) {
    sendStatic(res, "index.html");
  } else if (req.path.startsWith("/api/")) {
    let module = await import(`.${req.path}`);
    module.default(req, res, fastr);
  } else {
    sendStatic(res, req.path);
  }
}

function sendStatic(res: Response, which: string) {
  const absoluteFilePath = path.resolve(`${staticDir}/${which}`);
  if (fs.existsSync(absoluteFilePath)) {
    res.sendFile(absoluteFilePath);
  } else {
    Logger.debug(`REQUESTED NOT EXISTING PATH: ${absoluteFilePath}`);
    res.status(404).send("not found");
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
