let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let Promo = require("./Promo");

let BonuseSchema = new Schema({}, {
    discriminatorKey: "kind",
});

BonuseSchema.virtual('multilang', {
    ref: 'BonuseMultilang',
    localField: '_id',
    foreignField: 'promo',
    justOne: false
});

BonuseSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
module.exports = Promo.discriminator("Bonuse", BonuseSchema);

let Multilang = require("./BonuseMultilang");
BonuseSchema.pre("remove", async function (next) {
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