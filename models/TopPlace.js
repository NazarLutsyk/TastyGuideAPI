let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    actual: {
        type: Boolean,
        default: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
}, {
    timestamps: true,
});

TopPlaceSchema.methods.supersave = async function () {
    let Place = require('./Place');

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else if (place) {
        await Place.findByIdAndUpdate(place._id, {$push: {tops: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
TopPlaceSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {tops: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {tops: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('TopPlace', TopPlaceSchema);

let Place = require('./Place');
TopPlaceSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {tops: this._id},
            {$pull: {tops: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});