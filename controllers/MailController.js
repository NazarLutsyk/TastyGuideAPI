let nodemailer = require('nodemailer');
let config = require('../config/config');

//todo normal message format
module.exports = {
    sendMail(req, res, next) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.CONTACT_US.EMAIL,
                pass: config.CONTACT_US.PASS
            }
        });
        transporter.sendMail({
            from: config.CONTACT_US.EMAIL,
            to: config.ADMIN_EMAIL,
            subject: 'Message',
            text: 'I hope this message gets through!',
        }, (error, info) => {
            if (error) {
                return next(error);
            }
            res.json(info);
        });
    }
};