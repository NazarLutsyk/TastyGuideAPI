let router = require('express').Router();
let MailController = require('../controllers/MailController');
router.post('/send', MailController.sendMail);

module.exports = router;