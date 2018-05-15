module.exports = {
    isLoggedIn(req, res, next) {
        let doCheck = (res.locals.doCheck === true || res.locals.doCheck === undefined);
        if (doCheck) {
            if (req.isAuthenticated()) {
                return next();
            } else {
                let error = new Error();
                error.message = "Forbidden. You are not authenticated";
                error.status = 403;
                return next(error);
            }
        }else {
            return next();
        }
    },
    notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            let error = new Error("Forbidden");
            error.message = "Forbidden. You are authenticated";
            error.status = 403;
            next(error);
        }
    }
};