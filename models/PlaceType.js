let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceTypeMultilang'
    }],
}, {
    timestamps: true,
});
module.exports = mongoose.model('PlaceType', PlaceTypeSchema);

let Place = require('./Place');
let PlaceTypeMultilang = require('./PlaceTypeMultilang');
PlaceTypeSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {types: this._id},
            {$pull: {types: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await PlaceTypeMultilang.remove({placeType: this._id});
        return next();
    } catch (e) {
        return next(e);
    }
});
PlaceTypeSchema.pre('save', async function (next) {
    let self = this;
    try {
        let multilangs = await PlaceTypeMultilang.find({_id: this.multilang});
        if (multilangs.length <= 0 && this.multilang.length > 0) {
            return next(new Error('Not found related model!'));
        } else {
            for (let multilang of multilangs) {
                if (multilang.placeType == null) {
                    await PlaceTypeMultilang.findByIdAndUpdate(multilang._id, {placeType: self}, {
                        runValidators: true,
                        context: 'query'
                    });
                }
            }
            return next();
        }
    } catch (e) {
        return next(e);
    }
});