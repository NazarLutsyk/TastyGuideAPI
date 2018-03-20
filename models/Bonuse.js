let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let BonuseSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
    },
}, {
    discriminatorKey: 'kind'
});

module.exports = Promo.discriminator('Bonuse', BonuseSchema);

let Multilang = require('./BonuseMultilang');
BonuseSchema.pre('remove', async function (next) {
    try {
        await Multilang.remove({bonuse: this._id});
        return next();
    } catch (e) {
        return next(e);
    }
});