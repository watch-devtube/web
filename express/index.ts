
var app = require('./src/app')

export function devtube_green(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

export function devtube_blue(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

export function devtube_lime(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

export function devtube_purple(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}
