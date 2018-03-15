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

DaySchema.methods.supersave = async function () {
    let Place = require('./Place');

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else if (place) {
        await Place.findByIdAndUpdate(place._id, {$push: {days: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
DaySchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {days: this._id}},{runValidators: true, context: 'query'});
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {days: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};


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