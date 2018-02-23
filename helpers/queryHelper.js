module.exports = {
    toSelect(str) {
        let fields = str.split(',');
        let res = {};
        for (let field of fields) {
            if (field.startsWith('-')) {
                res[field.substr(1)] = 0;
            } else {
                res[field] = 1;
            }
        }
        return res;
    },
    toSort(str) {
        let fields = str.split(',');
        let res = {};
        for (let field of fields) {
            if (field.startsWith('-')) {
                res[field.substr(1)] = -1;
            } else {
                res[field] = 1;
            }
        }
        return res;
    },
    toPopulate(str) {
        let fields = str.split(',');
        return fields;
    },
};