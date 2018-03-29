const LangController = require(global.paths.CONTROLLERS + '/LangController');
const express = require('express');
let ROLES = require(global.paths.CONFIG + '/roles');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(LangController.getLangs)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        LangController.createLang
    );
router.route('/:id')
    .get(LangController.getLangById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        LangController.updateLang
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        LangController.removeLang
    );

module.exports = router;
