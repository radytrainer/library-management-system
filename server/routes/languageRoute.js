// server/routes/languageRoute.js
const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const authJwt = require("../middlewares/authJwt");

router.use(languageController.initI18n);
router.post('/toggle',authJwt.verifyToken, languageController.toggleLanguage);
router.get('/', authJwt.verifyToken, languageController.getCurrentTranslation);

module.exports = router;