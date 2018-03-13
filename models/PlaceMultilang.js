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
PlaceMultilangSchema.pre('save', async function (next) {
    try {
        let place = await Place.findById(this.place);
        this.place = place ? place._id : null;
        if (place && place.multilang.indexOf(this._id) == -1) {
            await Place.findByIdAndUpdate(place._id,{$push : {multilang : this}},{runValidators: true,context:'query'});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});
