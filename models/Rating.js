let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value : Number,
    comment : String,
    client : {
        type : Schema.Types.ObjectId,
        rel : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        rel : 'Place'
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('Rating',RatingSchema);