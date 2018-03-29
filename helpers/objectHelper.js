module.exports = {
    load(first,second){
        for (let key in second) {
            first[key] = second[key];
        }
        return first;
    },
    someKeyContains(obj,keys){
        for (let key of Object.keys(obj)) {
            if (keys.indexOf(key) !== -1) {
                return true;
            }
        }
        return false;
    }
};