const EventController = require(global.paths.CONTROLLERS + '/EventController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Promo');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(EventController.getEvents)
    .post(
        permission.rule(Rule.createPromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        EventController.createEvent
    );
router.route('/:id')
    .get(EventController.getEventById)
    .put(
        permission.rule(Rule.updatePromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        EventController.updateEvent
    )
    .delete(
        permission.rule(Rule.updatePromo,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        EventController.removeEvent
    );

module.exports = router;
