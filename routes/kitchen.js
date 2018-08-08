const KitchenController = require('../controllers/KitchenController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');
let ROLES = require('../config/roles');

const router = express.Router();

router.route('/')
    .get(KitchenController.getKitchens)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        KitchenController.createKitchen
    );
router.route('/:id')
    .get(KitchenController.getKitchenById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        KitchenController.updateKitchen
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        KitchenController.removeKitchen
    );
module.exports = router;
