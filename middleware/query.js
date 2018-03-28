let QueryHelper = require(global.paths.HELPERS + '/queryHelper');

module.exports = {
    parseQuery(req, res, next) {
        if (req.method.toLowerCase() === 'get') {
            try {
                let fields = req.query.fields;
                let sort = req.query.sort;
                let query = req.query.query;
                let skip = req.query.skip;
                let limit = req.query.limit;
                let populate = req.query.populate;
                let aggregate = req.query.aggregate;
                req.query.fields = fields ? QueryHelper.toSelect(fields) : null;
                req.query.sort = sort ? QueryHelper.toSort(sort) : null;
                req.query.query = query ? JSON.parse(query) : null;
                req.query.aggregate = aggregate ? JSON.parse(aggregate) : null;
                req.query.populate = populate ? QueryHelper.toPopulate(populate) : null;
                req.query.skip = skip ? +skip : 0;
                req.query.limit = limit ? +limit : null;
                return next();
            } catch (e) {
                return next(e);
            }
        }
        return next();
    }
};