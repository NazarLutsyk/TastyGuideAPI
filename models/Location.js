let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LocationSchema = new Schema({
    ltg: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('Location', LocationSchema);

let Place = require('./Place');
LocationSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {locations: this._id},
            {$pull: {locations: this._id}},
            {multi: true,runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
LocationSchema.pre('save', async function (next) {
    try {
        let place = await Place.findById(this.place);
        this.place = place ? place._id : null;
        if (place && !place.location) {
            return await Place.findByIdAndUpdate(place._id, {location: this},{runValidators: true,context:'query'});
        }else {
            this.place = null;
        }
        return next();
    } catch (e) {
        return next(e);
    }
});