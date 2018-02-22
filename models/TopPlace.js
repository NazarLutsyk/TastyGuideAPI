let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate : {
        type: Date,
        required : true
    },
    endDate : {
        type: Date,
        required : true
    },
    price : {
        type: Number,
        required : true
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place',
        required : true
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
TopPlaceSchema.pre('save', async function (next) {
    let place = await Place.findById(this.place);
    if (place) {
        place.tops.push(this);
        place.save();
        next();
    }
    let msg = 'Not found model:';
    if (!place){
        msg += 'Place';
    }
    next(new Error(msg));
});