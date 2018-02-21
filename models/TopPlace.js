let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate : Date,
    endDate : Date,
    price : Number,
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('TopPlace',TopPlaceSchema);