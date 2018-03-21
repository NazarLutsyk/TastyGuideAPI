const BonuseController = require(global.paths.CONTROLLERS + '/BonuseController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Promo');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseController.getBonuses)
    .post(permission(Rule.createPromo),BonuseController.createBonuse);
router.route('/:id')
    .get(BonuseController.getBonuseById)
    .put(permission(Rule.updatePromo),BonuseController.updateBonuse)
    .delete(permission(Rule.updatePromo),BonuseController.removeBonuse);
module.exports = router;
