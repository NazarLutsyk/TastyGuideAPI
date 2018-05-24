let nodemailer = require("nodemailer");
let MAIL = require("../config/mail");

//todo normal message format
module.exports = {
    sendMail(req, res, next) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: MAIL.BROKER.EMAIL,
                pass: MAIL.BROKER.PASS
            }
        });
        transporter.sendMail({
            from: MAIL.BROKER.EMAIL,
            to: req.body.email ? req.body.email : MAIL.ADMIN_EMAIL,
            subject: "Contact Us",
            text: `
                User email: ${req.body.clientEmail},
                Message: '${req.body.message}'
            `,
        }, (error, info) => {
            if (error) {
                error.status = 400;
                return next(error);
            }
            res.json(info);
        });
    }
};