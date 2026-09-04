// Page numbers for the static lists — filled automatically from listpages.json (second pass)
let loaded = { tables: {}, figures: {} };
try {
  loaded = require("../listpages.json");
} catch (e) {
  // first pass: zeros
}
const Z = (o, keys) => Object.fromEntries(keys.map(k => [k, (o && o[k]) || "۰"]));
module.exports = {
  tables: Z(loaded.tables, ["2-1", "2-2", "3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "4-1", "4-2", "5-1"]),
  figures: Z(loaded.figures, ["2-1", "3-1", "3-2a", "3-2b", "3-3", "3-4", "4-1", "5-1"]),
};
