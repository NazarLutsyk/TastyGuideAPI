let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MajorPlaceSchema = new Schema({
    startDate : Date,
    endDate : Date,
    price : Number,
    place : {
        type : Schema.Types.ObjectId,
        rel : 'Place'
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('MajorPlace',MajorPlaceSchema);