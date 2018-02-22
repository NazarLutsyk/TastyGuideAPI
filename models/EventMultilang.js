let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let EventMultilangSchema = new Schema({
    header : String,
    description : String,
    event : {
        type : Schema.Types.ObjectId,
        ref : 'Event'
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('EventMultilang', EventMultilangSchema);

let Promo = require('./Promo');
EventMultilangSchema.pre('remove',async function (next) {
    await Promo.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});