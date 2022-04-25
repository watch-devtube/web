import "./utils";
import { dnsCache } from "./libs/Dns";
import { Timer } from "./timer";

let coldstartTime = new Timer("cold start").withWarningIfSlow();

dnsCache();

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
    msg: (req: Request, res) => {
      const slow = res.responseTime >= 2000;
      return `${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms ${slow ? '(slow)' : ''}`;
    }
  })
);

require("./routes/index")(app);

coldstartTime.print();

if (process.env.NODE_ENV === "development") {
  const listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

module.exports = app;
