const MessageController = require(global.paths.CONTROLLERS + '/MessageController');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Message');

const router = express.Router();

router.route('/')
    .get(MessageController.getMessages)
    .post(MessageController.createMessage);
router.route('/:id')
    .get(MessageController.getMessageById)
    .delete(
        permission.rule(Rule.deleteMessage,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        MessageController.removeMessage
    );

module.exports = router;
