const DayController = require(global.paths.CONTROLLERS + '/DayController');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Day');

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
