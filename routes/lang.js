const LangController = require('../controllers/LangController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(LangController.getLangs)
    .post(permission(),LangController.createLang);
router.route('/:id')
    .get(LangController.getLangById)
    .put(permission(),LangController.updateLang)
    .delete(permission(),LangController.removeLang);

module.exports = router;
