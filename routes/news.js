const NewsController = require('../controllers/NewsController');
let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Promo');
let ROLES = require('../config/roles');
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
