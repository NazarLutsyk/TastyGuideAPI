let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate : {
        type: Date,
        required : true,
        validate : {
            validator : function (){
                return this.startDate < this.endDate;
            },
            message : 'Start date must be smaller than end date!'
        }
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
let winston = require(global.paths.CONFIG + '/winston');
TopPlaceSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {tops: this._id},
            {$pull: {tops: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
TopPlaceSchema.pre('save', async function (next) {
    try {
        let place = await Place.findById(this.place);
        this.place = place ? place._id : '';
        if (place && place.tops.indexOf(this._id) == -1) {
            return await Place.findByIdAndUpdate(place._id,{$push : {tops : this}});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});