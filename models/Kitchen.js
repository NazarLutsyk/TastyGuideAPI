let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let KitchenSchema = new Schema({},
    {
        timestamps: true,
        toJSON: {virtuals: true, getters: true},
        toObject: {virtuals: true, getters: true},
    });

KitchenSchema.virtual("multilang", {
    ref: "KitchenMultilang",
    localField: "_id",
    foreignField: "kitchen",
    justOne: false
});

KitchenSchema.virtual("places", {
    ref: "places",
    localField: "_id",
    foreignField: "kitchens",
    justOne: false
});

KitchenSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

KitchenSchema.methods.supersave = async function () {
    log("save Kitchen");
    return await this.save();
};

KitchenSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");

    objectHelper.load(this, newDoc);
    log("update Kitchen");
    return await this.save();
};

module.exports = mongoose.model("kitchen", KitchenSchema);

let Place = require("./Place");
let Multilang = require("./KitchenMultilang");
KitchenSchema.pre("remove", async function (next) {
    try {
        let multilangs = await Multilang.find({kitchen: this._id});
        for (const multilang of multilangs) {
            await multilang.remove();
        }
        await Place.update(
            {kitchens: this._id},
            {$pull: {kitchens: this._id}},
            {multi: true, runValidators: true, context: "query"});
        return next();
    } catch (e) {
        return next(e);
    }
});

