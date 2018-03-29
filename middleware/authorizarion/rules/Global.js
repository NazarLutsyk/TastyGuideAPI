let objectHelper = require(global.paths.HELPERS + '/objectHelper');

exports.updatable = function (notAllowed) {
    return async function (req, res, next) {
        try {
            if (req.body && objectHelper.someKeyContains(req.body, notAllowed)) {
                res.sendStatus(400);
            } else {
                next();
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};
