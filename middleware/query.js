let QueryHelper = require("../helpers/queryHelper");

module.exports = {
    parseQuery(req, res, next) {
        if (req.method.toLowerCase() === "get") {
            try {
                req.query = QueryHelper.normalizeQuery(req.query);
                log("query ", req.query);
                console.log(req.query);
                return next();
            } catch (e) {
                e.status = 400;
                return next(e);
            }
        }
        return next();
    }
};