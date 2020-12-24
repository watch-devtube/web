module.exports = app => {
  app.use("/api/s", require("./search"));
  app.use("/api/liking", require("./liking"));
  app.use("/api/videos", require("./videos"));
};