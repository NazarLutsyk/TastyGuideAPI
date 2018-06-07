let passport = require("passport");
module.exports = {
    signUp(req, res, next) {
        passport.authenticate("local.signup", function (err, user) {
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
    facebookAuth(req, res, next) {
        if (req.user) {
            return res.status(200).json(req.user);
        } else {
            let e = new Error();
            e.status = 400;
            return next(e);
        }
    },
    googleAuth(req, res, next) {
        if (req.user) {
            return res.status(200).json(req.user);
        } else {
            let e = new Error();
            e.status = 400;
            return next(e);
        }
    },
    googleNative(req, res, next){
        if (req.user) {
            return res.status(200).json(req.user);
        } else {
            let e = new Error();
            e.status = 400;
            return next(e);
        }
    },
    facebookNative(req, res, next){
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