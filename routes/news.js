const NewsController = require(global.paths.CONTROLLERS + '/NewsController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Promo');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsController.getNews)
    .post(
        permission.rule(Rule.createPromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        NewsController.createNews
    );
router.route('/:id')
    .get(NewsController.getNewsById)
    .put(
        permission.rule(Rule.updatePromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        NewsController.updateNews
    )
    .delete(
        permission.rule(Rule.updatePromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        NewsController.removeNews
    );
module.exports = router;
