const NewsMultilangController = require('../controllers/NewsMultilangController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/PromoMultilang');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsMultilangController.getNewsMultilangs)
    .post(permission(Rules.updatePromoMultilang),NewsMultilangController.createNewsMultilang);
router.route('/:id')
    .get(NewsMultilangController.getNewsMultilangById)
    .put(permission(Rules.updatePromoMultilang),NewsMultilangController.updateNewsMultilang)
    .delete(permission(Rules.updatePromoMultilang),NewsMultilangController.removeNewsMultilang);

module.exports = router;
