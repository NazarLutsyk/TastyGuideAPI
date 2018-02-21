const EventMultilangController = require('../controllers/EventMultilangController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventMultilangController.getEventMultilangs)
    .post(EventMultilangController.createEventMultilang);
router.route('/:id')
    .get(EventMultilangController.getEventMultilangById)
    .put(EventMultilangController.updateEventMultilang)
    .delete(EventMultilangController.removeEventMultilang);

module.exports = router;
