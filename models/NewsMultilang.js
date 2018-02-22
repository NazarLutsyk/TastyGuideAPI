let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let NewsMultilangSchema = new Schema({
    header : String,
    description : String,
    news : {
        type : Schema.Types.ObjectId,
        ref : 'News'
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('NewsMultilang', NewsMultilangSchema);

let Promo = require('./Promo');
NewsMultilangSchema.pre('remove',async function (next) {
    await Promo.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});