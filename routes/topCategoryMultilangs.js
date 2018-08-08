const TopCategoryMultilangController = require('../controllers/TopCategoryMultilangController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');
let ROLES = require('../config/roles');

const router = express.Router();

router.route('/')
    .get(TopCategoryMultilangController.getTopCategoryMultilang)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopCategoryMultilangController.createTopCategoryMultilang
    );
router.route('/:id')
    .get(TopCategoryMultilangController.getTopCategoryMultilangById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopCategoryMultilangController.updateTopCategoryMultilang
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopCategoryMultilangController.removeTopCategoryMultilang
    );

module.exports = router;
