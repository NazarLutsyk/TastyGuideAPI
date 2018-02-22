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
        required: true
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('PlaceMultilang', PlaceMultilangSchema);

let Place = require('./Place');
PlaceMultilangSchema.pre('remove', async function (next) {
    await Place.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});
PlaceMultilangSchema.pre('save', async function (next) {
    let place = await Place.findById(this.place);
    if (place) {
        place.multilang.push(this);
        place.save();
        next();
    }
    let msg = 'Not found model:';
    if (!place){
        msg += 'Place ';
    }
    next(new Error(msg));
});
