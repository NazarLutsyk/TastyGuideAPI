let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LangSchema = new Schema({
    name : String,
},{
    timestamps : true,
});

module.exports = mongoose.model('Lang',LangSchema);