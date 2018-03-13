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
    actual : {
        type : Boolean,
        default : true
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place',
    },
},{
    timestamps : true,
});
module.exports = mongoose.model('TopPlace',TopPlaceSchema);

let Place = require('./Place');
TopPlaceSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {tops: this._id},
            {$pull: {tops: this._id}},
            {multi: true,runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
TopPlaceSchema.pre('save', async function (next) {
    try {
        let place = await Place.findById(this.place);
        this.place = place ? place._id : null;
        if (place && place.tops.indexOf(this._id) == -1) {
            await Place.findByIdAndUpdate(place._id,{$push : {tops : this}},{runValidators: true,context:'query'});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});