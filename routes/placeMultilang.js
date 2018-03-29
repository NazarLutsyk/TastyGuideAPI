const PlaceMultilangController = require(global.paths.CONTROLLERS + '/PlaceMultilangController');
const express = require('express');
let ROLES = require(global.paths.CONFIG + '/roles');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/PlaceMultilang');

const router = express.Router();

router.route('/')
    .get(PlaceMultilangController.getPlaceMultilangs)
    .post(
        permission.rule(Rule.createPlaceMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceMultilangController.createPlaceMultilang
    );
router.route('/:id')
    .get(PlaceMultilangController.getPlaceMultilangById)
    .put(
        permission.rule(Rule.updatePlaceMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceMultilangController.updatePlaceMultilang
    )
    .delete(
        permission.rule(Rule.updatePlaceMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceMultilangController.removePlaceMultilang
    );

module.exports = router;
