const EventController = require(global.paths.CONTROLLERS + '/EventController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Promo');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventController.getEvents)
    .post(permission(Rule.updatePromo),EventController.createEvent);
router.route('/:id')
    .get(EventController.getEventById)
    .put(permission(Rule.updatePromo),EventController.updateEvent)
    .delete(permission(Rule.updatePromo),EventController.removeEvent);

module.exports = router;
