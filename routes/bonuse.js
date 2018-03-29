const BonuseController = require(global.paths.CONTROLLERS + '/BonuseController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Promo');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseController.getBonuses)
    .post(
        permission.rule(Rule.createPromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        BonuseController.createBonuse
    );
router.route('/:id')
    .get(BonuseController.getBonuseById)
    .put(
        permission.rule(Rule.updatePromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        BonuseController.updateBonuse
    )
    .delete(
        permission.rule(Rule.updatePromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        BonuseController.removeBonuse
    );
module.exports = router;
