const { Fastr } = require("./libs/Fastr");
const indexFile = "index-new.json"
console.time("fastr init")
module.exports.fastr = new Fastr({ indexFile });
console.timeEnd("fastr init")
