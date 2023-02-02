function initRoute(app, route, requirePath) {
  console.time(route + " init")
  app.use(route, require(requirePath));
  console.timeEnd(route + " init")
}

module.exports = app => {
  initRoute(app, "/api/s", "./search");
  initRoute(app, "/api/videos", "./videos");
  initRoute(app, "/api/auth", "./auth");
  initRoute(app, "/api/stats", "./stats");
  initRoute(app, "/api/sitemap", "./sitemap");
  initRoute(app, "/api/rss", "./rss");
  initRoute(app, "/api/og", "./og");
  initRoute(app, "/api/user", "./user");
  initRoute(app, "/api/tweets", "./tweets");
  initRoute(app, "/api/youtube", "./youtube");
};