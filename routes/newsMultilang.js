const NewsMultilangController = require('../controllers/NewsMultilangController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/PromoMultilang');
let ROLES = require('../config/roles');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsMultilangController.getNewsMultilangs)
    .post(
        permission.rule(Rules.createPromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        NewsMultilangController.createNewsMultilang
    );
router.route('/:id')
    .get(NewsMultilangController.getNewsMultilangById)
    .put(
        permission.rule(Rules.updatePromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        NewsMultilangController.updateNewsMultilang
    )
    .delete(
        permission.rule(Rules.updatePromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        NewsMultilangController.removeNewsMultilang
    );

module.exports = router;
