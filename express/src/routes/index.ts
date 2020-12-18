module.exports = app => {
  app.use("/api/fts", require("./fts"));
  app.use("/api/s", require("./search"));
  app.use("/api/karma", require("./karma"));
  app.use("/api/liking", require("./liking"));
  app.use("/api/videos", require("./videos"));
  app.use("/api/lists", require("./lists"));
};