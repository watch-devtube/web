module.exports = app => {
  app.use("/s", require("./search"));
  app.use("/videos", require("./videos"));
  app.use("/auth", require("./auth"));
  app.use("/stats", require("./stats"));
  app.use("/sitemap", require("./sitemap"));
  app.use("/rss", require("./rss"));
  app.use("/user", require("./user"));
  app.use("/tweets", require("./tweets"));
  app.use("/youtube", require("./youtube"));
};