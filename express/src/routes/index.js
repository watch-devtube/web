module.exports = app => {
  app.use("/api/s", require("./search"));
  app.use("/api/videos", require("./videos"));
  app.use("/api/magic", require("./magic"));
};