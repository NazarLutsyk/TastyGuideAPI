const EventController = require('../controllers/EventController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventController.getEvents)
    .post(EventController.createEvent);
router.route('/:id')
    .get(EventController.getEventById)
    .put(EventController.updateEvent)
    .delete(EventController.removeEvent);

module.exports = router;
