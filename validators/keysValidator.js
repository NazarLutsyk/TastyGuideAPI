module.exports = {
    diff(first,second){
        let error = [];
        first = Object.keys(first);
        second = Object.keys(second);

        for (let key of second) {
            if (first.indexOf(key) === -1) {
                error.push(key);
            }
        }
        if (error.length > 0) return error;
        else return false;

    }
};