const path = require('path');
const fs = require('fs');
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'km'], // ✅ English + Khmer
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  objectNotation: true,
  register: global, 
});

exports.initI18n = (req, res, next) => {
  i18n.init(req, res, next);
};

exports.toggleLanguage = async (req, res) => {
  try {
    const requestedLocale = req.body?.locale || "en";

    // ✅ normalize locale (accept both "km" and "kh")
    let newLocale;
    if (["km", "kh"].includes(requestedLocale.toLowerCase())) {
      newLocale = "km"; // always store/use km internally
    } else {
      newLocale = "en";
    }

    // ✅ tell i18n to switch for this request
    req.setLocale(newLocale);

    // ✅ load the translations JSON
    const translationPath = path.join(__dirname, `../locales/${newLocale}.json`);
    const translations = fs.existsSync(translationPath)
      ? JSON.parse(fs.readFileSync(translationPath, "utf8"))
      : {};

    return res.json({
      success: true,
      message: `Language switched to ${newLocale}`,
      data: {
        locale: newLocale,
        translations,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error switching language",
      error: err.message,
    });
  }
};



exports.getCurrentTranslation = async (req, res) => {
  try {
    const locale = req.getLocale() || 'en';
    const translationPath = path.join(__dirname, `../locales/${locale}.json`);

    if (!fs.existsSync(translationPath)) {
      return res.status(404).json({
        success: false,
        message: `Translation file for ${locale} not found`,
      });
    }

    const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));

    return res.status(200).json({
      success: true,
      data: { locale, translations },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving translations',
      error: error.message,
    });
  }
};
