import { Fastr } from "devtube-commons";
import { Logger } from "devtube-commons";

const path = require("path");

console.log(`Cwd: ${process.cwd()}`);

const dataDir = path.resolve(process.cwd(), "data");
console.log(dataDir);

Logger.time("Fastr init");
const fastr = new Fastr({ dataDir, serialized: true });
Logger.timeEnd("Fastr init");

module.exports = fastr;
