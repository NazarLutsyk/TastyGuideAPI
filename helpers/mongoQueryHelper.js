module.exports.universalFind = async function (context, query) {
    let modelQuery;
    if (query.aggregate) {
        modelQuery = context.aggregate(query.aggregate);
    } else {
        modelQuery = context
            .find(query.query)
            .sort(query.sort)
            .select(query.select)
            .skip(query.skip)
            .limit(query.limit);
        if (query.populate) {
            for (let populateField of query.populate) {
                modelQuery.populate(populateField);
            }
        }
    }
    return await modelQuery.exec();
};

