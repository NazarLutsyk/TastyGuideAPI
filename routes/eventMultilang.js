const EventMultilangController = require('../controllers/EventMultilangController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/PromoMultilang');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventMultilangController.getEventMultilangs)
    .post(permission(Rules.updatePromoMultilang),EventMultilangController.createEventMultilang);
router.route('/:id')
    .get(EventMultilangController.getEventMultilangById)
    .put(permission(Rules.updatePromoMultilang),EventMultilangController.updateEventMultilang)
    .delete(permission(Rules.updatePromoMultilang),EventMultilangController.removeEventMultilang);

module.exports = router;
