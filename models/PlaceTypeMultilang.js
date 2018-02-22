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
        required: true
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('PlaceTypeMultilang', PlaceTypeMultilangSchema);

let PlaceType = require('./PlaceType');
PlaceTypeMultilangSchema.pre('remove',async function (next) {
    await PlaceType.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});
PlaceTypeMultilangSchema.pre('save', async function (next) {
    let placeType = await PlaceType.findById(this.placeType);
    if (placeType) {
        placeType.multilang.push(this);
        placeType.save();
        next();
    }
    let msg = 'Not found model:';
    if (!placeType){
        msg += 'PlaceType ';
    }
    next(new Error(msg));
});