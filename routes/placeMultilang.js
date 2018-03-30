const PlaceMultilangController = require('../controllers/PlaceMultilangController');
const express = require('express');
let ROLES = require('../config/roles');
let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/PlaceMultilang');

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
