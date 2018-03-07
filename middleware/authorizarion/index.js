let ROLES = require(global.paths.CONFIG + '/roles');
module.exports = function (rule, ...allowed) {

    function isAllowed(roles) {
        for (let role of roles) {
            if (allowed.indexOf(role) != -1) {
                return true;
            }
        }
        return false;
    }

    return (req, res, next) => {
        if (req.user.roles.indexOf(ROLES.GLOBAL_ROLES.ADMIN_ROLE) != -1){
            return next();
        }
        if (typeof rule != 'function' && rule) {
            allowed.push(rule);
            rule = null;
        }

        if (allowed.indexOf(ROLES.GLOBAL_ROLES.ADMIN_ROLE) == -1) {
            allowed.push(ROLES.GLOBAL_ROLES.ADMIN_ROLE);
        }

        if (req.user && isAllowed(req.user.roles) && rule) {
            return rule(req, res, next);
        }
        if (req.user && isAllowed(req.user.roles)) {
            return next();
        }
        else if (rule) {
            return rule(req, res, next);
        } else {
            res.sendStatus(403);
        }
    };
};