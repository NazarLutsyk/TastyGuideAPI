let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceTypeMultilangSchema = new Schema({
    name : String,
    placeType : {
        type : Schema.Types.ObjectId,
        ref: 'PlaceType'
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