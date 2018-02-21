let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DaySchema = new Schema({
    date : Date,
    startTime : Date,
    endTime : Date,
    holiday : Boolean,
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    }
},{
    timestamps : true,
});

module.exports = mongoose.model('Day',DaySchema);