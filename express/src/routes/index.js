module.exports = app => {
  app.use("/s", require("./search"));
  app.use("/liking", require("./liking"));
  app.use("/videos", require("./videos"));
};