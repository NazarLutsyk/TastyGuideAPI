const MessageController = require('../controllers/MessageController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Message');

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
