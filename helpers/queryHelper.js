module.exports = {
    normalizeQuery(oldQuery) {
        let query = {
            aggregate: null,
            query: {},
            sort: null,
            select: null,
            skip: 0,
            limit: null,
            populate: null
        };
        if (oldQuery) {
            query.aggregate = oldQuery.aggregate ? JSON.parse(oldQuery.aggregate) : null;
            query.query = oldQuery.query ? JSON.parse(oldQuery.query) : {};
            query.sort = oldQuery.sort ? JSON.parse(oldQuery.sort) : null;
            query.select = oldQuery.select ? JSON.parse(oldQuery.select) : null;
            query.skip = oldQuery.skip ? JSON.parse(oldQuery.skip) : 0;
            query.limit = oldQuery.limit ? JSON.parse(oldQuery.limit) : null;
            query.populate = oldQuery.populate ? JSON.parse(oldQuery.populate) : null;
        }
        return query;
    }
};