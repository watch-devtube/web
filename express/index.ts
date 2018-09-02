
var app = require('./src/app')

export function proxyBlue(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}

export function proxyGreen(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}
