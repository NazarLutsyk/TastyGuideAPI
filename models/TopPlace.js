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

let Place = require('./Place');
TopPlaceSchema.pre('remove',async function (next) {
    await Place.update(
        {tops: this._id},
        {$pull: {tops: this._id}},
        {multi: true});
    next();
});