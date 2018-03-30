const TopPlaceController = require('../controllers/TopPlaceController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');
let ROLES = require('../config/roles');

const router = express.Router();

router.route('/')
    .get(TopPlaceController.getTopPlaces)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopPlaceController.createTopPlace
    );
router.route('/:id')
    .get(TopPlaceController.getTopPlaceById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopPlaceController.updateTopPlace
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopPlaceController.removeTopPlace
    );

module.exports = router;
