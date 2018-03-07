const EventMultilangController = require(global.paths.CONTROLLERS + '/EventMultilangController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rules = require(global.paths.MIDDLEWARE + '/authorizarion/rules/PromoMultilang');
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
