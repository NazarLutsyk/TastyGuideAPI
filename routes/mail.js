let router = require('express').Router();
let MailController = require(global.paths.CONTROLLERS + '/MailController');
router.post('/send', MailController.sendMail);

module.exports = router;