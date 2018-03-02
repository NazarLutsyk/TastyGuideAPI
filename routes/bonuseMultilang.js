const BonuseMultilangController = require('../controllers/BonuseMultilangController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/PromoMultilang');
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
