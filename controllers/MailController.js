let nodemailer = require('nodemailer');
let MAIL = require('../config/mail');

//todo normal message format
module.exports = {
    sendMail(req, res, next) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAIL.BROKER.EMAIL,
                pass: MAIL.BROKER.PASS
            }
        });
        transporter.sendMail({
            from: MAIL.BROKER.EMAIL,
            to: MAIL.ADMIN_EMAIL,
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