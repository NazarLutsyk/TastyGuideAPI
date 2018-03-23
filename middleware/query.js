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
                req.query.fields = fields ? QueryHelper.toSelect(fields) : {};
                req.query.sort = sort ? QueryHelper.toSort(sort) : {};
                req.query.query = query ? JSON.parse(query) : {};
                req.query.populate = populate ? QueryHelper.toPopulate(populate) : '';
                req.query.skip = skip ? +skip : 0;
                req.query.limit = limit ? +limit : '';
                return next();
            } catch (e) {
                return next(e);
            }
        }
        return next();
    }
};