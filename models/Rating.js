let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value : Number,
    comment : String,
    client : {
        type : Schema.Types.ObjectId,
        ref : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('Rating',RatingSchema);