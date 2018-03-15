let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceTypeMultilangSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    placeType : {
        type : Schema.Types.ObjectId,
        ref: 'PlaceType',
    },
}, {
    discriminatorKey: 'kind'
});

PlaceTypeMultilangSchema.methods.supersave = async function () {
    let PlaceType = require('./PlaceType');

    let placeType = await PlaceType.findById(this.placeType);

    if (!placeType && this.placeType) {
        throw new Error('Not found related model PlaceType!');
    } else if (placeType) {
        await PlaceType.findByIdAndUpdate(placeType._id, {$push: {multilang: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
PlaceTypeMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let PlaceType = require('./PlaceType');

    if (newDoc.placeType && newDoc.placeType != this.placeType) {
        let newPlace = await PlaceType.findById(newDoc.placeType);
        if (newPlace) {
            await PlaceType.findByIdAndUpdate(this.placeType, {$pull: {multilang: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await PlaceType.update(
                {_id: newPlace._id},
                {$addToSet: {multilang: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model PlaceType!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = Multilang.discriminator('PlaceTypeMultilang', PlaceTypeMultilangSchema);

let PlaceType = require('./PlaceType');
PlaceTypeMultilangSchema.pre('remove',async function (next) {
    try {
        await PlaceType.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true,runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});