const CityController = require('../controllers/CityController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');
let ROLES = require('../config/roles');

const router = express.Router();

router.route('/')
    .get(CityController.getCities)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        CityController.createCity
    );
router.route('/:id')
    .get(CityController.getCityById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        CityController.updateCity
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        CityController.removeCity
    );
module.exports = router;
