const DayController = require('../controllers/DayController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Day');

const router = express.Router();

router.route('/')
    .get(DayController.getDays)
    .post(permission(Rule.updateDay),DayController.createDay);
router.route('/:id')
    .get(DayController.getDayById)
    .put(permission(Rule.updateDay),DayController.updateDay)
    .delete(permission(Rule.updateDay),DayController.removeDay);

module.exports = router;
