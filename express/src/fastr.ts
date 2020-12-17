import { Fastr } from "devtube-commons";
import { Timer } from "./timer";
import * as path from "path";

const cwd = process.cwd();

const { lokiDir, lunrDir } = process.env;

const fastrInitTime = new Timer("fastr init").withWarningIfSlow();

let fastr: Fastr;
if (lokiDir) {
  fastr = new Fastr({ lokiDir: path.resolve(cwd, lokiDir), serialized: true });
} else if (lunrDir) {
  fastr = new Fastr({ lunrDir: path.resolve(cwd, lunrDir), serialized: true });
} else {
  // A "fat" lambda that includes both loki and lunr data. Used for local development.
  fastr = new Fastr({ dataDir: path.resolve(cwd, "data"), serialized: true });
}


fastrInitTime.print();

module.exports = fastr;
