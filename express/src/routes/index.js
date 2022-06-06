function initRoute(app, route, requirePath) {
  console.time(route + " init")
  app.use(route, require(requirePath));
  console.timeEnd(route + " init")
}

module.exports = app => {
  initRoute(app, "/s", "./search");
  initRoute(app, "/videos", "./videos");
  initRoute(app, "/auth", "./auth");
  initRoute(app, "/stats", "./stats");
  initRoute(app, "/sitemap", "./sitemap");
  initRoute(app, "/rss", "./rss");
  initRoute(app, "/og", "./og");
  initRoute(app, "/user", "./user");
  initRoute(app, "/tweets", "./tweets");
  initRoute(app, "/youtube", "./youtube");
};