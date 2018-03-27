const MessageController = require(global.paths.CONTROLLERS + '/MessageController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Message');

const router = express.Router();

router.route('/')
    .get(MessageController.getMessages)
    .post(MessageController.createMessage);
router.route('/:id')
    .get(permission(Rule.getMessage),MessageController.getMessageById)
    .delete(permission(Rule.deleteMessage),MessageController.removeMessage);

module.exports = router;
