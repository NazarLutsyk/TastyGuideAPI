let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let NewsSchema = new Schema({
}, {
    discriminatorKey: 'kind'
});

NewsSchema.virtual('multilang', {
    ref: 'NewsMultilang',
    localField: '_id',
    foreignField: 'promo',
    justOne: false
});

NewsSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

module.exports = Promo.discriminator('News', NewsSchema);

let Multilang = require('./NewsMultilang');
NewsSchema.pre('remove', async function (next) {
    try {
        let multilangs = await Multilang.find({promo: this._id});
        for (const multilang of multilangs) {
            await multilang.remove();
        }
        return next();
    } catch (e) {
        return next(e);
    }
});