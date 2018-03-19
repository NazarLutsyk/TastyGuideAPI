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

LocationSchema.methods.supersave = async function (context) {
    let Place = require('./Place');

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else if (place) {
        await context.update(
            {place: this.place},
            {place: null},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Place.findByIdAndUpdate(place._id, {location: this._id}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
LocationSchema.methods.superupdate = async function (context, newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await context.update(
                {place: newDoc.place},
                {place: null},
                {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                }
            );
            await Place.findByIdAndUpdate(this.place, {location: null}, {runValidators: true, context: 'query'});
            await Place.update(
                {_id: newPlace._id},
                {location: this._id},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('Location', LocationSchema);

let Place = require('./Place');
LocationSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {location: this._id},
            {location: null},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});