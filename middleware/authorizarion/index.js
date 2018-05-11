function isAllowed(allowed, userRoles) {
    for (let role of userRoles) {
        if (allowed.indexOf(role) !== -1) {
            return true;
        }
    }
    return false;
}

exports.roles = function (...roles) {
    return (req, res, next) => {
        log("check roles");
        if (!roles) {
            return next();
        }
        for (let role of roles) {
            if (typeof role !== "string") {
                let error = new Error();
                error.status = 400;
                return next(error);
            }
        }
        if (req.user && isAllowed(roles, req.user.roles)) {
            return next();
        }
        let error = new Error();
        error.message = "Forbidden";
        error.status = 403;
        return next(error);
    };
};

exports.rule = function (rule, ...exclusionRoles) {
    return (req, res, next) => {
        try {
            log('check rule');
            if (exclusionRoles && isAllowed(exclusionRoles, req.user.roles)) {
                return next();
            } else {
                if (typeof rule !== "function") {
                    let error = new Error();
                    error.status = 400;
                    return next(error);
                } else {
                    return rule(req, res, next);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    };
};
