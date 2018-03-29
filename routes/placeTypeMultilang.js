const PlaceTypeMultilangController = require(global.paths.CONTROLLERS+ '/PlaceTypeMultilangController');
const express = require('express');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let ROLES = require(global.paths.CONFIG + '/roles');

const router = express.Router();

router.route('/')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangs)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceTypeMultilangController.createPlaceTypeMultilang
    );
router.route('/:id')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceTypeMultilangController.updatePlaceTypeMultilang
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceTypeMultilangController.removePlaceTypeMultilang
    );

module.exports = router;
