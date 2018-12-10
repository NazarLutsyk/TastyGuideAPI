let passport = require("passport");
let Client = require("../models/Client");
let mail = require("../helpers/mailHelper");
let crypto = require("crypto");
let globalConfig = require("../config/global");
let {sendMail} = require('../helpers/mailHelper');

module.exports = {
    async signUp(req, res, next) {
        let body = req.body;
        try {
            if (await Client.count({$or: [{login: body.login}, {email: body.email, login: {$ne: '', $exists: true}}]})
                || !body.email || !body.password || !body.name || !body.surname || !body.login) {
                let e = new Error();
                e.status = 400;
                return next(e);
            } else {
                let bodyJson = JSON.stringify(body);
                let encoded = Buffer.from(bodyJson).toString("base64");
                let url = globalConfig.HOST + "auth/local/signup/callback?data=" + encoded;
                await mail.sendMail(body.email, "Sign Up", `
                    <h3>Congratulations on your registration with the Tasty guide application.</h3> 
                    <p>To complete the registration, follow the link and log in using your nickname and password.</p>
                    =================================================================================================<br>
                    ${url} <br/>
                    =================================================================================================<br>
                `);
                return res.json({ok: true});
            }
        } catch (e) {
            return next(e);
        }

    },
    async register(req, res, next) {
        try {
            if (req.query.data) {
                let decoded = Buffer.from(req.query.data, "base64").toString("utf8");
                let user = JSON.parse(decoded);

                let alreadyExists = await Client.count({
                    $or: [{login: user.login}, {
                        email: user.email,
                        login: {$ne: '', $exists: true}
                    }]
                });

                if (alreadyExists <= 0) {
                    let client = new Client({
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        login: user.login,
                    });
                    client.password = client.encryptPassword(user.password);
                    client = await client.save();
                    res.sendStatus(200);
                } else {
                    let error = new Error();
                    error.status = 400;
                    return next(error);
                }
            } else {
                let error = new Error();
                error.status = 400;
                return next(error);
            }
        } catch (e) {
            return next(e);
        }
    },
    signIn(req, res, next) {
        passport.authenticate("local.signin", function (err, user) {
            if (err) {
                err.status = 400;
                return next(err);
            }
            if (!user) {
                let e = new Error();
                e.status = 400;
                return next(e);
            }
            req.logIn(user, function (err) {
                if (err) {
                    err.status = 400;
                    return next(err);
                }
                return res.status(200).json(req.user);
            });
        })(req, res, next);
    },
    googleNative(req, res, next) {
        if (req.user) {
            return res.status(200).json(req.user);
        } else {
            let e = new Error();
            e.status = 400;
            return next(e);
        }
    },
    facebookNative(req, res, next) {
        if (req.user) {
            return res.status(200).json(req.user);
        } else {
            let e = new Error();
            e.status = 400;
            return next(e);
        }
    },
    logout(req, res) {
        req.logout();
        res.json({ok: true});
    },
    async generateRecoverCode(req, res) {
        try {
            let email = req.body.email;
            let clientExists = await Client.count({email, login: {$ne: '', $exists: true}});
            let client = await Client.findOne({email, login: {$ne: '', $exists: true}});
            if (clientExists) {
                let code = Math.floor(Math.random() * (999999 - 100000) + 100000);
                req.session.recoverCode = code;
                await sendMail(email, 'Recover password', `Login: ${client.login} <br/> Recover code: ${code}`);
                return res.json(true);
            } else {
                return res.json(false);
            }
        } catch (e) {
            return next(e);
        }
    },
    verifyRecoverCode(req, res) {
        try {
            let inputtedCode = (req.body.code + '').trim();
            let realCode = req.session.recoverCode ? req.session.recoverCode : Math.floor(Math.random() * (999999 - 100000) + 100000);
            if (inputtedCode == realCode) {
                delete req.session.recoverCode;
                return res.json(true);
            } else {
                return res.json(false);
            }
        } catch (e) {
            return next(e);
        }
    },
    async changePassword(req, res) {
        try {
            let newPassword = req.body.password;
            let email = req.body.email;

            let client = await Client.findOne({email, login: {$ne: '', $exists: true}});

            if (client && newPassword && newPassword.length >= 4) {
                client.password = client.encryptPassword(newPassword);
                await client.save();
                return res.json(true);
            } else {
                return res.json(false);
            }
        } catch (e) {
            return next(e);
        }
    }
};