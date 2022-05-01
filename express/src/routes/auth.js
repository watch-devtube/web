const router = require("express").Router();
const passport = require("passport");
const TwitterStrategy = require('passport-twitter');

const devtubeHost = process.env.DEVTUBE_HOST || 'https://dev.tube'

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback',
  proxy: true,
  includeEmail: true
},
  function verify(_token, _tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

router.get('/loggedIn', (req, res) => {
  const loggedIn = !!req.user;
  console.log("Logged in ? " + loggedIn);
  res.json({ loggedIn })
})

router.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(devtubeHost);
});

router.get('/twitter', (req, res) => {
  console.log(req.headers);
  passport.authenticate('twitter')(req, res)
});

router.get('/twitter/callback',
  passport.authenticate('twitter', { assignProperty: 'twitterProfile', failureRedirect: '/' }),
  (req, res, next) => {
    const user = {
      email: req.twitterProfile.emails[0].value,
      username: req.twitterProfile.username,
      provider: req.twitterProfile.provider
    };
    req.login(user, (err) => {
      if (err) { return next(err); }
      res.redirect(devtubeHost);
    });
  });


module.exports = router;
