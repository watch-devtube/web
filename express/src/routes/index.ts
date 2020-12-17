module.exports = app => {
  app.use("/api/search", require("./search"));
  app.use("/api/fts", require("./search"));
  app.use("/api/s", require("./search"));
  app.use("/api/karma", require("./karma"));
  app.use("/api/liking", require("./liking"));
  app.use("/api/videos", require("./videos"));
  app.use("/api/myvideos", require("./myvideos"));
  app.use("/api/lists", require("./lists"));
};
