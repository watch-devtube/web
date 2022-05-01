const router = require("express").Router();
const passport = require("passport");
const TwitterStrategy = require('passport-twitter');
const GitHubStrategy = require('passport-github2');

const devtubeHost = process.env.DEVTUBE_HOST || 'https://dev.tube'

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
},
  function verify(_token, _tokenSecret, profile, cb) {
    const avatar = profile.photos[0].value
    const email = profile.emails[0].value
    if (!avatar || !email) {
      throw "Sorry, unable to retrieve data from Twitter"
    }
    const user = {
      avatar,
      email,
      username: profile.username,
      provider: profile.provider
    };
    return cb(null, user);
  }
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback',
  proxy: true,
  includeEmail: true
},
  function verify(_token, _tokenSecret, profile, cb) {
    const avatar = profile.photos[0].value
    const email = profile.emails[0].value
    if (!avatar || !email) {
      throw "Sorry, unable to retrieve data from Twitter"
    }
    const user = {
      avatar,
      email,
      username: profile.username,
      provider: profile.provider
    };
    return cb(null, user);
  }));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

router.get('/loggedIn', (req, res) => {
  const loggedIn = !!req.user;
  console.log(req.user);
  const avatar = req.user?.avatar;
  res.json({ loggedIn, avatar })
})

router.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(devtubeHost);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(devtubeHost);
  });


router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
  passport.authenticate('twitter', { assignProperty: 'twitterProfile', failureRedirect: '/' }),
  (req, res, next) => {
    req.login(req.twitterProfile, (err) => {
      if (err) { return next(err); }
      res.setHeader('Cache-Control', 'private');  // Recommended by Firebase https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
      res.redirect(devtubeHost);
    });
  });


module.exports = router;
