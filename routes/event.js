const EventController = require('../controllers/EventController');
let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Promo');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventController.getEvents)
    .post(permission(Rule.updatePromo),EventController.createEvent);
router.route('/:id')
    .get(EventController.getEventById)
    .put(permission(Rule.updatePromo),EventController.updateEvent)
    .delete(permission(Rule.updatePromo),EventController.removeEvent);
router.route('/:id/multilangs/:idMultilang')
    .put(permission(),EventController.addMultilang)
    .delete(permission(),EventController.removeMultilang);
module.exports = router;
