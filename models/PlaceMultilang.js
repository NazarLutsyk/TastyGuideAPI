let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceMultilangSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
}, {
    discriminatorKey: 'kind'
});

PlaceMultilangSchema.methods.supersave = async function () {
    let Place = require('./Place');

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else if (place) {
        await Place.findByIdAndUpdate(place._id, {$push: {multilang: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
PlaceMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {multilang: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {multilang: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = Multilang.discriminator('PlaceMultilang', PlaceMultilangSchema);

let Place = require('./Place');
PlaceMultilangSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true,runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});