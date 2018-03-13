module.exports = {
    load(first,second){
        for (let key in second) {
            first[key] = second[key];
        }
        return first;
    }
};