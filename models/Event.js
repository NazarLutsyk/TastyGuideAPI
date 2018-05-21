let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let Promo = require("./Promo");

let EventSchema = new Schema({}, {
    discriminatorKey: "kind",
});

EventSchema.virtual('multilang', {
    ref: 'EventMultilang',
    localField: '_id',
    foreignField: 'promo',
    justOne: false
});

EventSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
module.exports = Promo.discriminator("Event", EventSchema);

let Multilang = require("./EventMultilang");
EventSchema.pre("remove", async function (next) {
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