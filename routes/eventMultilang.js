const EventMultilangController = require(global.paths.CONTROLLERS + '/EventMultilangController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rules = require(global.paths.MIDDLEWARE + '/authorizarion/rules/PromoMultilang');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventMultilangController.getEventMultilangs)
    .post(
        permission.rule(Rules.createPromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        EventMultilangController.createEventMultilang
    );
router.route('/:id')
    .get(EventMultilangController.getEventMultilangById)
    .put(
        permission.rule(Rules.updatePromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        EventMultilangController.updateEventMultilang
    )
    .delete(
        permission.rule(Rules.updatePromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        EventMultilangController.removeEventMultilang
    );

module.exports = router;
