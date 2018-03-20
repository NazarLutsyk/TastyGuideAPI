let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
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