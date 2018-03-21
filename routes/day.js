const DayController = require(global.paths.CONTROLLERS + '/DayController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Day');

const router = express.Router();

router.route('/')
    .get(DayController.getDays)
    .post(permission(Rule.createDay),DayController.createDay);
router.route('/:id')
    .get(DayController.getDayById)
    .put(permission(Rule.updateDay),DayController.updateDay)
    .delete(permission(Rule.updateDay),DayController.removeDay);

module.exports = router;
