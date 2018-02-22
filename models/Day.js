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

let Place = require('./Place');
DaySchema.pre('remove',async function (next) {
    await Place.update(
        {days: this._id},
        {$pull: {days: this._id}},
        {multi: true});
    next();
});