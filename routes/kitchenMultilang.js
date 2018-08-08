const KitchenMultilangController = require('../controllers/KitchenMultilangController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');
let ROLES = require('../config/roles');

const router = express.Router();

router.route('/')
    .get(KitchenMultilangController.getKitchenMultilangs)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        KitchenMultilangController.createKitchenMultilang
    );
router.route('/:id')
    .get(KitchenMultilangController.getKitchenMultilangById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        KitchenMultilangController.updateKitchenMultilang
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        KitchenMultilangController.removeKitchenMultilang
    );

module.exports = router;
