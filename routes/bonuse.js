const BonuseController = require('../controllers/BonuseController');
let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Promo');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseController.getBonuses)
    .post(permission(Rule.updatePromo),BonuseController.createBonuse);
router.route('/:id')
    .get(BonuseController.getBonuseById)
    .put(permission(Rule.updatePromo),BonuseController.updateBonuse)
    .delete(permission(Rule.updatePromo),BonuseController.removeBonuse);
router.route('/:id/multilangs/:idMultilang')
    .put(permission(),BonuseController.addMultilang)
    .delete(permission(),BonuseController.removeMultilang);
module.exports = router;
