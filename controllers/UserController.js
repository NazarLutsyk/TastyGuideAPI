let passport = require("passport");
let Client = require("../models/Client");
let mail = require("../helpers/mailHelper");
let crypto = require("crypto");
let globalConfig = require("../config/global");

module.exports = {
    async signUp(req, res, next) {
        let body = req.body;
        try {
            if (await Client.count({$or: [{login: body.login}, {email: body.email}]})
                || !body.email || !body.password || !body.name || !body.surname || !body.login) {
                let e = new Error();
                e.status = 400;
                return next(e);
            } else {
                let bodyJson = JSON.stringify(body);
                let encoded = Buffer.from(bodyJson).toString("base64");
                let url = globalConfig.HOST + "auth/local/signup/callback?data=" + encoded;
                await mail.sendMail(body.email, "Sign Up", url);
                return res.json({ok : true});
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
    }
};