var app = require('./src/app')

module.exports.devtube_green = function devtube_green(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

module.exports.devtube_blue = function devtube_blue(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

module.exports.devtube_lime = function devtube_lime(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

module.exports.devtube_purple = function devtube_purple(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}
