const MessageController = require('../controllers/MessageController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(MessageController.getMessages)
    .post(MessageController.createMessage);
router.route('/:id')
    .get(MessageController.getMessageById)
    .delete(MessageController.removeMessage);

module.exports = router;
