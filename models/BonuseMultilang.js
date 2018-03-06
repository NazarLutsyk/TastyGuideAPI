let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let BonuseMultilangSchema = new Schema({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    conditions: {
        type: String,
        required: true
    },
    bonuse: {
        type: Schema.Types.ObjectId,
        ref: 'Bonuse',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('BonuseMultilang', BonuseMultilangSchema);

let Promo = require('./Bonuse');
BonuseMultilangSchema.pre('remove', async function (next) {
    try {
        await Promo.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
BonuseMultilangSchema.pre('save', async function (next) {
    try {
        let promo = await Promo.findById(this.bonuse);
        this.bonuse = promo ? promo._id : '';
        if (promo && promo.multilang.indexOf(this._id) == -1) {
            return await Promo.findByIdAndUpdate(promo._id,{$push : {multilang : this}});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});