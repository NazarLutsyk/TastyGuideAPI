const NewsController = require('../controllers/NewsController');
let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Promo');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsController.getNews)
    .post(permission(Rule.updatePromo),NewsController.createNews);
router.route('/:id')
    .get(NewsController.getNewsById)
    .put(permission(Rule.updatePromo),NewsController.updateNews)
    .delete(permission(Rule.updatePromo),NewsController.removeNews);
router.route('/:id/multilangs/:idMultilang')
    .put(permission(),NewsController.addMultilang)
    .delete(permission(),NewsController.removeMultilang);

module.exports = router;
