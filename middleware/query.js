let QueryHelper = require("../helpers/queryHelper");

module.exports = {
    parseQuery(req, res, next) {
        if (req.method.toLowerCase() === "get") {
            try {
                let target = req.query.target;
                let fetch = req.query.fetch;

                target = target ? JSON.parse(target) : null;
                fetch = fetch ? JSON.parse(fetch) : null;
                let resTarget = {};
                let resFetch = [];

                resTarget = QueryHelper.normalizeQuery(target);
                if (fetch && fetch.length > 0) {
                    for (let fetchModel of fetch) {
                        let fetchModelName = Object.keys(fetchModel)[0];
                        let normalized = QueryHelper.normalizeQuery(fetchModel[fetchModelName]);
                        normalized.aggregate = null;
                        resFetch.push({[fetchModelName]: normalized});
                    }
                }
                req.query.target = resTarget;
                req.query.fetch = resFetch;
                log("query ", req.query);
                return next();
            } catch (e) {
                e.status = 400;
                return next(e);
            }
        }
        return next();
    }
};