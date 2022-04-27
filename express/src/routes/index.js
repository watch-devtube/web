module.exports = app => {
  app.use("/s", require("./search"));
  app.use("/videos", require("./videos"));
  app.use("/magic", require("./magic"));
};