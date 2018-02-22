let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CurrencySchema = new Schema({
    value : {
        type : String,
        required : true
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('Currency',CurrencySchema);