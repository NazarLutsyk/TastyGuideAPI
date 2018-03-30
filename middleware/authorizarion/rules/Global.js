let objectHelper = require('../../../helpers/objectHelper');

exports.updatable = function (notAllowed) {
    return async function (req, res, next) {
        try {
            log('rule updatable');
            if (req.body && objectHelper.someKeyContains(req.body, notAllowed)) {
                let error = new Error();
                error.message = 'Forbidden';
                error.status = 403;
                return next(error);
            } else {
                next();
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
