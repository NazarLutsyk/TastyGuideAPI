let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CurrencySchema = new Schema({
    value : String,
},{
    timestamps : true,
});

module.exports = mongoose.model('Currency',CurrencySchema);