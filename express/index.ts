
var app = require('./src/app')

export function proxy(req, res) {
  if (!req.url) {
    req.url = '/'
    req.path = '/'
  }
  return app(req, res)
}
