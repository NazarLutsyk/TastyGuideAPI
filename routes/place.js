const PlaceController = require(global.paths.CONTROLLERS + '/PlaceController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let ROLES = require(global.paths.CONFIG + '/roles');
let PlaceRule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Place');
let GlobalRule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Global');
let Place = require(global.paths.MODELS + '/Place');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceController.getPlaces)
    .post(
        permission.rule(GlobalRule.updatable(Place.notUpdatable),ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        permission.rule(PlaceRule.updatable,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceController.createPlace
    );
router.route('/:id')
    .get(PlaceController.getPlaceById)
    .put(
        permission.rule(GlobalRule.updatable(Place.notUpdatable),ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        permission.rule(PlaceRule.updatePlace,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceController.updatePlace
    )
    .delete(
        permission.rule(PlaceRule.deletePlace,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceController.removePlace
    );
module.exports = router;
