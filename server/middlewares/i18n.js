// middlewares/i18n.js
const path = require("path");
const i18n = require("i18n");

i18n.configure({
  locales: ["en", "km"],
  directory: path.join(__dirname, "../locales"),
  defaultLocale: "en",
  objectNotation: true,
  register: global,
  autoReload: true,   // ✅ reload json when changed
  updateFiles: false, // ✅ don’t overwrite your json
});

module.exports = {
  initI18n: i18n.init,
  i18n,
};
