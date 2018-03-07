const BonuseMultilangController = require(global.paths.CONTROLLERS + '/BonuseMultilangController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rules = require(global.paths.MIDDLEWARE + '/authorizarion/rules/PromoMultilang');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseMultilangController.getBonuseMultilangs)
    .post(permission(Rules.updatePromoMultilang),BonuseMultilangController.createBonuseMultilang);
router.route('/:id')
    .get(BonuseMultilangController.getBonuseMultilangById)
    .put(permission(Rules.updatePromoMultilang),BonuseMultilangController.updateBonuseMultilang)
    .delete(permission(Rules.updatePromoMultilang),BonuseMultilangController.removeImage);

module.exports = router;
