const router = require("express").Router();
const passport = require("passport");
const TwitterStrategy = require('passport-twitter');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth2');

const successRedirect = process.env.DEVTUBE_HOST || 'https://dev.tube'

function toUserProfile(_token, _tokenSecret, profile, cb) {
  const avatar = profile.photos[0].value
  const email = profile.emails[0].value
  if (!avatar || !email) {
    throw "Sorry, unable to retrieve user data from OAuth provider"
  }
  const user = {
    avatar,
    email,
    username: profile.username,
    provider: profile.provider
  };
  return cb(null, user);
}

passport.use(new GitHubStrategy({
  clientID: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  proxy: true
},
  toUserProfile
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback',
  proxy: true,
  includeEmail: true
},
  toUserProfile));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  proxy: true
},
  toUserProfile));


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
  res.redirect(successRedirect);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { successRedirect, failureRedirect: '/' }));

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect, failureRedirect: '/' }));

router.get('/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
  ));
router.get('/google/callback',
  passport.authenticate('google', { successRedirect, failureRedirect: '/' }));


module.exports = router;
