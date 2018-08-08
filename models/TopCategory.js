let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TopCategorySchema = new Schema({}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},
});

TopCategorySchema.virtual("multilang", {
    ref: "TopCategoryMultilang",
    localField: "_id",
    foreignField: "topCategory",
    justOne: false
});

TopCategorySchema.virtual("places", {
    ref: "places",
    localField: "_id",
    foreignField: "topCategories",
    justOne: false
});

TopCategorySchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

TopCategorySchema.methods.supersave = async function () {
    log("save TopCategory");
    return await this.save();
};

TopCategorySchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");

    objectHelper.load(this, newDoc);
    log("update TopCategory");
    return await this.save();
};

module.exports = mongoose.model("TopCategory", TopCategorySchema);

let Place = require("./Place");
let Multilang = require("./TopCategoryMultilang");
TopCategorySchema.pre("remove", async function (next) {
    try {
        let multilangs = await Multilang.find({topCategory: this._id});
        for (const multilang of multilangs) {
            await multilang.remove();
        }
        await Place.update(
            {topCategories: this._id},
            {$pull: {topCategories: this._id}},
            {multi: true, runValidators: true, context: "query"});
        return next();
    } catch (e) {
        return next(e);
    }
});

