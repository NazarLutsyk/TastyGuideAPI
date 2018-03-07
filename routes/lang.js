const LangController = require(global.paths.CONTROLLERS + '/LangController');
const express = require('express');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(LangController.getLangs)
    .post(permission(),LangController.createLang);
router.route('/:id')
    .get(LangController.getLangById)
    .put(permission(),LangController.updateLang)
    .delete(permission(),LangController.removeLang);

module.exports = router;
