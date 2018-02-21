const LangController = require('../controllers/LangController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(LangController.getLangs)
    .post(LangController.createLang);
router.route('/:id')
    .get(LangController.getLangById)
    .put(LangController.updateLang)
    .delete(LangController.removeLang);

module.exports = router;
