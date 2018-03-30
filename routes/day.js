const DayController = require('../controllers/DayController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Day');

const router = express.Router();

router.route('/')
    .get(DayController.getDays)
    .post(
        permission.rule(Rule.createDay,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DayController.createDay
    );
router.route('/:id')
    .get(DayController.getDayById)
    .put(
        permission.rule(Rule.updateDay,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DayController.updateDay
    )
    .delete(
        permission.rule(Rule.updateDay,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DayController.removeDay
    );

module.exports = router;
