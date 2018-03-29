let ROLES = require(global.paths.CONFIG + "/roles");

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
        if (!roles) {
            return next();
        }
        for (let role of roles) {
            if (typeof role !== "string") {
                return res.sendStatus(400);
            }
        }
        if (req.user && isAllowed(roles, req.user.roles)) {
            return next();
        }
        return res.sendStatus(403);
    };
};

exports.rule = function (rule, ...exclusionRoles) {
    return function (req, res, next) {
        if (exclusionRoles && isAllowed(exclusionRoles, req.user.roles)) {
            return next();
        } else {
            if (typeof rule !== "function") {
                return res.sendStatus(400);
            } else {
                return rule(req, res, next);
            }
        }
    };
};
