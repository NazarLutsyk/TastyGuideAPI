const LangController = require('../controllers/LangController');
const express = require('express');
let ROLES = require('../config/roles');
let permission = require('../middleware/authorizarion/index');

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
