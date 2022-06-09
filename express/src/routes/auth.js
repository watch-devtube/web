const asyncHandler = require('express-async-handler')
const router = require("express").Router();
const passport = require("passport");
const TwitterStrategy = require('passport-twitter');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth2');
const { statsForever } = require('../libs/Stats');

const { returnBack } = require("../libs/Middlewares")

const successRedirect = process.env.DEVTUBE_HOST || 'https://dev.tube'
const successReturnToOrRedirect = successRedirect
const admins = ['eduards@sizovs.net', 'eduards@devternity.com', 'eduards.sizovs@gmail.com']

function toUserProfile(request, access_token, refresh_token, profile, done) {
  const avatar = profile.photos[0].value
  const email = profile.emails[0].value
  if (!avatar || !email) {
    throw "Sorry, unable to retrieve user data from OAuth"
  }

  const admin = admins.includes(email);

  const user = request.user || {
    avatar,
    email,
    admin,
    username: profile.username || email.split("@")[0],
    provider: profile.provider
  };

  user[profile.provider] = { access_token, refresh_token }

  return done(null, user);
}

passport.use(new GitHubStrategy({
  clientID: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  passReqToCallback: true,
  scope: ['user:email'],
  proxy: true
},
  toUserProfile
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback',
  passReqToCallback: true,
  proxy: true,
  includeEmail: true
},
  toUserProfile));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
  proxy: true
},
  toUserProfile));


passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

router.get('/loggedIn', asyncHandler(async (req, res) => {
  const loggedIn = !!req.user;

  const username = req.user?.username;
  const avatar = req.user?.avatar;
  const admin = !!req.user?.admin;
  const youtubeAccess = !!req.user?.google

  const calculateKarma = async () => {
    if (loggedIn) {
      const stats = await statsForever();
      return stats.karma[username] || 0
    } else {
      return 0;
    }
  }

  const karma = await calculateKarma();

  res.json({ loggedIn, admin, avatar, username, karma, youtubeAccess })
}))

router.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(req.query.returnTo);
});

const googleScopes = ['email', 'profile', 'https://www.googleapis.com/auth/youtube.force-ssl']

router.get('/github', returnBack, passport.authenticate('github'));
router.get('/twitter', returnBack, passport.authenticate('twitter'));
router.get('/google', returnBack, passport.authenticate('google', {
  scope: googleScopes, accessType: 'offline', prompt: 'consent'
}));

router.get('/google/callback',
  passport.authenticate('google', { successReturnToOrRedirect, failureRedirect: '/' }));

router.get('/twitter/callback',
  passport.authenticate('twitter', { successReturnToOrRedirect, failureRedirect: '/' }));

router.get('/github/callback',
  passport.authenticate('github', { successReturnToOrRedirect, failureRedirect: '/' }));

module.exports = router;
