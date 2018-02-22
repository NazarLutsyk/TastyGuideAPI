let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let BonuseMultilangSchema = new Schema({
    header : String,
    description : String,
    conditions : String,
    bonuse : {
        type : Schema.Types.ObjectId,
        ref : 'Bonuse'
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('BonuseMultilang', BonuseMultilangSchema);

let Promo = require('./Promo');
BonuseMultilangSchema.pre('remove',async function (next) {
    await Promo.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});