const dnsCache = require("dnscache");

console.time("Cold start")

dnsCache({
  enable: true,
  ttl: 300,
  cachesize: 1000,
});

let express = require("express");
let body = require("body-parser");
let cors = require("cors");
let winston = require("winston");
let expressWinston = require("express-winston");
let app = express();
let port = process.env.PORT || 8100;

app.set("port", port);
app.use(cors());
app.use(body.json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false,
    msg: (req, res) => {
      const slow = res.responseTime >= 2000;
      return `${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms ${slow ? '(slow)' : ''}`;
    }
  })
);

require("./routes/index")(app);

console.timeEnd("Cold start")

if (process.env.MODE === "dev") {
  const listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

module.exports = app;
