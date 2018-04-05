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
            query.aggregate = oldQuery.aggregate ? oldQuery.aggregate : null;
            query.query = oldQuery.query ? oldQuery.query : {};
            query.sort = oldQuery.sort ? oldQuery.sort : null;
            query.select = oldQuery.select ? oldQuery.select : null;
            query.skip = oldQuery.skip ? oldQuery.skip : 0;
            query.limit = oldQuery.limit ? oldQuery.limit : null;
            query.populate = oldQuery.populate ? oldQuery.populate : null;
        }
        return query;
    }
};