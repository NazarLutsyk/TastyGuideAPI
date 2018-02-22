let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceMultilangSchema = new Schema({
    name : String,
    description : String,
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('PlaceMultilang', PlaceMultilangSchema);

let Place = require('./Place');
PlaceMultilangSchema.pre('remove',async function (next) {
    await Place.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});
