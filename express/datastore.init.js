const Datastore = require("@google-cloud/datastore");
const path = require("path");
const fs = require("fs");

(async function () {
  const videoDir = path.resolve("./data/videos");
  if (!fs.existsSync(videoDir) || !fs.readdirSync(videoDir).length) {
    throw `Test video dataset missing under ${videoDir}. See README.md.`;
  }

  const videoFiles = fs.readdirSync(videoDir);
  console.log(`Ready to ingest ${videoFiles.length} videos into Datastore...`);

  const datastore = new Datastore();
  const items = videoFiles
    .map((it) => fs.readFileSync(path.resolve(videoDir, it), "utf8"))
    .map((it) => JSON.parse(it))
    .map((it) => ({
      data: it,
      key: datastore.key(["video", it.objectID]),
      excludeFromIndexes: ["description"],
    }));

  await Promise.all(items.map((it) => datastore.save(it)));

  console.log("Videos have been ingested into Datastore.");
})();
