const dnsCache = require("dnscache");
const isDevMode = process.env.MODE === "dev"
require('dotenv').config()

console.time("Cold start")

dnsCache({
  enable: true,
  ttl: 300,
  cachesize: 1000,
});

const express = require("express");
const morgan = require('morgan');
const passport = require("passport");
const body = require("body-parser");
const cors = require("cors");
const cookieSession = require("./src/libs/Cookies");
const app = express();
const port = process.env.PORT || 8100;

app.use(cookieSession({
  name: '__session', // limitation because Firebase only supports that cookie name
  signed: false,     // limitation because Firebase only supports __session cookie, no __session.sig.
  domain: isDevMode ? '.devtube.xxx' : '.dev.tube',
  secret: process.env.COOKIE_SECRET,
}))
app.use(passport.initialize());
app.use(passport.session());

app.set("port", port);
app.use(cors({
  credentials: true,
  origin: isDevMode ? true : 'https://dev.tube'
}));
app.use(body.json());
app.use(morgan('tiny'))


console.time("Routes init")
require("./src/routes/index")(app);
console.timeEnd("Routes init")

console.timeEnd("Cold start")

if (isDevMode) {
  const listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

exports.api = app;
