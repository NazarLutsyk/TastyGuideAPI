const MessageController = require('../controllers/MessageController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Message');

const router = express.Router();

router.route('/')
    .get(permission(),MessageController.getMessages)
    .post(MessageController.createMessage);
router.route('/:id')
    .get(permission(Rule.getMessage),MessageController.getMessageById)
    .delete(permission(Rule.deleteMessage),MessageController.removeMessage);

module.exports = router;
