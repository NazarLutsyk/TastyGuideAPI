let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let NewsSchema = new Schema({
}, {
    discriminatorKey: 'kind'
});

module.exports = Promo.discriminator('News', NewsSchema);

let Multilang = require('./NewsMultilang');
NewsSchema.pre('remove', async function (next) {
    try {
        await Multilang.remove({promo: this._id});
        return next();
    } catch (e) {
        return next(e);
    }
});