import { Fastr } from "devtube-commons";
import { Timer } from "./timer";

const path = require("path");

console.log(`Cwd: ${process.cwd()}`);

const dataDir = path.resolve(process.cwd(), "data");
console.log(dataDir);

const fastrInitTime = new Timer("fastr init").withWarningIfSlow();
const fastr = new Fastr({ dataDir, serialized: true });
fastrInitTime.print();

module.exports = fastr;
