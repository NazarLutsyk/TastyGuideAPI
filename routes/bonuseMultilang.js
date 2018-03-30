const BonuseMultilangController = require('../controllers/BonuseMultilangController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/PromoMultilang');
let ROLES = require('../config/roles');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseMultilangController.getBonuseMultilangs)
    .post(
        permission.rule(Rules.createPromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        BonuseMultilangController.createBonuseMultilang
    );
router.route('/:id')
    .get(BonuseMultilangController.getBonuseMultilangById)
    .put(
        permission.rule(Rules.updatePromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        BonuseMultilangController.updateBonuseMultilang
    )
    .delete(
        permission.rule(Rules.updatePromoMultilang,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        BonuseMultilangController.removeImage
    );

module.exports = router;
