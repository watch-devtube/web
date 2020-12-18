import { Fastr } from "devtube-commons";
import { Timer } from "./timer";
import * as path from "path";

const cwd = process.cwd();

const fastrInitTime = new Timer("fastr init").withWarningIfSlow();

const fastr = new Fastr({ dataDir: path.resolve(cwd, "data"), serialized: true });

fastrInitTime.print();

module.exports = fastr;
