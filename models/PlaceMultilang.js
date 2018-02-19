let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceMultilangSchema = new Schema({
    name : String,
    description : String,
    place : {
        type : Schema.Types.ObjectId,
        rel : 'Place'
    },
    lang : {
        type : Schema.Types.ObjectId,
        rel : 'Lang'
    }
},{
    timestamps : true,
});

module.exports = mongoose.model('PlaceMultilang',PlaceMultilangSchema);