let mail = require("../helpers/mailHelper");
let MAIL = require("../config/mail");

//todo normal message format
module.exports = {
    async sendMail(req, res, next) {
        try {
            let to = req.body.to ? req.body.to : MAIL.ADMIN_EMAIL;
            let subject = "Contact Us";
            let text = `User email: ${req.body.from},
                        Message: ${req.body.message}`;
            let mailResult = await mail.sendMail(to, subject, text);
            return res.json(mailResult);
        } catch (e) {
            return next(e);
        }
    }
};