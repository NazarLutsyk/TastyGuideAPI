module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.sendStatus(403);
    },
    notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.sendStatus(403);
    }
};