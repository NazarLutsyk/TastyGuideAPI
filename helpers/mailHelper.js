let nodemailer = require("nodemailer");
let MAIL = require("../config/mail");

exports.sendMail = function (to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: MAIL.BROKER.EMAIL,
            pass: MAIL.BROKER.PASS
        }
    });
    return new Promise((resolve, reject) => {
        if (to && subject && text) {
            transporter.sendMail({
                from: MAIL.BROKER.EMAIL,
                to: to,
                subject: subject,
                html: text,
            }, (error, info) => {
                if (error) {
                    error.status = 400;
                    reject(error);
                }
                resolve(info);
            });
        } else {
            let e = new Error("Missed required fields!");
            e.status = 400;
            reject(e);
        }
    });
};