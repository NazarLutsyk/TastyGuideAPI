let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
    name : String
},{
    timestamps : true,
});

module.exports = mongoose.model('PlaceType',PlaceTypeSchema);