const BonuseMultilangController = require(global.paths.CONTROLLERS + '/BonuseMultilangController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rules = require(global.paths.MIDDLEWARE + '/authorizarion/rules/PromoMultilang');
let ROLES = require(global.paths.CONFIG + '/roles');
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
