const router = require("express").Router();
const postmark = require("postmark");
const memoize = require("memoizee");

const lazyPostmark = memoize(() => new postmark.ServerClient(process.env.POSTMARK_API_KEY));
const { generateMagicToken, generateAuthToken, authTokenCookie } = require("../libs/auth")
const { isValidEmail } = require("../libs/validation")

router.get("/click/:magicToken", (req, res) => {
  const { magicToken } = req.params;
  try {
    const { authToken, redirectUrl } = generateAuthToken(magicToken);
    res.cookie('devtube-jwt', authToken, authTokenCookie());
    res.redirect(redirectUrl)
  } catch {
    res.send("Invalid or expired token.")
  }
})

router.post("/send", (req, res) => {
  const { origin } = req.headers;
  const { email } = req.body;
  if (!isValidEmail(email)) {
    res.status(500).send("Not a valid email");
    return;
  }

  const magicToken = generateMagicToken(email, origin);


  const magicLink = `${req.protocol}://${req.headers.host}/magic/click/${magicToken}`
  lazyPostmark().sendEmail({
    From: "auth@dev.tube",
    To: email,
    Subject: "DevTube Magic Link",
    HtmlBody: `Someone (hopefully you) requested a log in link to DevTube. If that's you, please click <a href="${magicLink}">the link</a>. If not, just ignore this message.`
  });

  console.log()
  res.send("OK");

});

module.exports = router;
