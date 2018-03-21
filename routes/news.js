const NewsController = require(global.paths.CONTROLLERS + '/NewsController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Promo');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsController.getNews)
    .post(permission(Rule.createPromo),NewsController.createNews);
router.route('/:id')
    .get(NewsController.getNewsById)
    .put(permission(Rule.updatePromo),NewsController.updateNews)
    .delete(permission(Rule.updatePromo),NewsController.removeNews);
module.exports = router;
