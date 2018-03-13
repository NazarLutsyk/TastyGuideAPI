let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DaySchema = new Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    holiday: {
        type: Boolean,
        default: false
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('Day', DaySchema);

let Place = require('./Place');
DaySchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {days: this._id},
            {$pull: {days: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
DaySchema.pre('save', async function (next) {
    try {
        let place = await Place.findById(this.place);
        this.place = place ? place._id : null;
        if (place && place.days.indexOf(this._id) == -1) {
            await Place.findByIdAndUpdate(place._id, {$push: {days: this}}, {
                runValidators: true,
                context: 'query'
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});