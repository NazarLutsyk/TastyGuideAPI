const CityMultilangController = require('../controllers/CityMultilangController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');
let ROLES = require('../config/roles');

const router = express.Router();

router.route('/')
    .get(CityMultilangController.getCityMultilangs)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        CityMultilangController.createCityMultilang
    );
router.route('/:id')
    .get(CityMultilangController.getCityMultilangById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        CityMultilangController.updateCityMultilang
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        CityMultilangController.removeCityMultilang
    );

module.exports = router;
