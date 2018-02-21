const DayController = require('../controllers/DayController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(DayController.getDays)
    .post(DayController.createDay);
router.route('/:id')
    .get(DayController.getDayById)
    .put(DayController.updateDay)
    .delete(DayController.removeDay);

module.exports = router;
