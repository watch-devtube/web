import { Fastr } from "devtube-commons";
import { Timer } from "./timer";

const time = new Timer("fastr init").withWarningIfSlow();
const indexFile = "index-new.json"
export const fastr = new Fastr({ indexFile });
time.print();
