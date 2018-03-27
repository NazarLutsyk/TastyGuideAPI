let passport = require('passport');
module.exports = {
    signUp(req, res, next) {
        passport.authenticate('local.signup', function (err, user, info) {
            if (err) {
                return res.status(400).send(err);
            }
            if (!user) {
                return res.sendStatus(400);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({
                    user: req.user
                });
            });
        })(req, res, next);
    },
    signIn(req, res, next) {
        passport.authenticate('local.signin', function (err, user, info) {
            if (err) {
                return res.status(400).send(err);
            }
            if (!user) {
                return res.sendStatus(400);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({
                    user: req.user
                });
            });
        })(req, res, next);
    },
    facebookAuth(req, res) {
        if (req.user) {
            return res.status(200).json({
                user: req.user
            });
        }else {
            return res.sendStatus(400);
        }
    },
    googleAuth(req, res) {
        console.log('controller');
        if (req.user) {
            return res.status(200).json({
                user: req.user
            });
        }else {
            return res.sendStatus(400);
        }
    },
    logout(req, res, next) {
        req.logout();
        res.sendStatus(200);
    }
};