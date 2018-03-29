const PlaceTypeController = require(global.paths.CONTROLLERS + '/PlaceTypeController');
const express = require('express');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let ROLES = require(global.paths.CONFIG + '/roles');

const router = express.Router();

router.route('/')
    .get(PlaceTypeController.getPlaceTypes)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceTypeController.createPlaceType
    );
router.route('/:id')
    .get(PlaceTypeController.getPlaceTypeById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceTypeController.updatePlaceType
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceTypeController.removePlaceType
    );
module.exports = router;
