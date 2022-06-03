const returnBack = (req, _res, next) => {
  req.session.returnTo = req.query.returnTo
  next();
}

const authenticated = (req, res, next) => {
  if (!req.user) {
    res.sendStatus(403)
    return;
  }
  next();
}

const adminsOnly = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    res.sendStatus(403)
    return;
  }
  next();
}

module.exports.authenticated = authenticated;
module.exports.returnBack = returnBack;
module.exports.adminsOnly = adminsOnly;

