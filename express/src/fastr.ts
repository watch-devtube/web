import { Fastr } from "devtube-commons";
import { Timer } from "./timer";

const path = require("path");
const cwd = process.cwd();

const { lokiDir, lunrDir } = process.env;

const fastrInitTime = new Timer("fastr init").withWarningIfSlow();

let fastr: Fastr;
if (lokiDir) {
  // uncomment after commons upgrade
  // fastr = new Fastr({ lokiDir: path.resolve(cwd, lokiDir), serialized: true });
} else if (lunrDir) {
  // uncomment after commons upgrade
  // fastr = new Fastr({ lunrDir: path.resolve(cwd, lunrDir), serialized: true });
} else {
  // Backward compatibility with a "fat" lambda that includes
  // both loki and lundr. Remove after migration.
  fastr = new Fastr({ dataDir: path.resolve(cwd, "data"), serialized: true });
}


fastrInitTime.print();

module.exports = fastr;
