import "./utils";
import { dnsCache, Logger } from "devtube-commons";

// Configuration settings
Logger.enabled = true;
Logger.time("Application start");

// Configure DNS cache
dnsCache();

// Configure Express application dependencies
let express = require("express");
let body = require("body-parser");
let cors = require("cors");
let winston = require("winston");
let expressWinston = require("express-winston");
let app = express();
let port = process.env.PORT || 8100;

require("./fastr");

app.set("port", port);
app.use(cors());
app.use(body.json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false,
    expressFormat: true
  })
);

Logger.timeEnd("Application start");

require("./routes/index")(app);

if (process.argv[2] === "dev") {
  const listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

module.exports = app;
