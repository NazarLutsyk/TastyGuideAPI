module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }else {
            let error = new Error();
            error.message = 'Forbidden. You are not authenticated';
            error.status = 403;
            next(error);
        }
    },
    notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }else {
            let error = new Error('Forbidden');
            error.message = 'Forbidden. You are authenticated';
            error.status = 403;
            next(error);
        }
    }
};