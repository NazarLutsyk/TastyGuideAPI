let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({}, {
    timestamps: true,
    toJSON: {virtuals:true, getters: true},
    toObject: {virtuals:true, getters: true},
});

PlaceTypeSchema.virtual('multilang', {
    ref: 'PlaceTypeMultilang',
    localField: '_id',
    foreignField: 'placeType',
    justOne: false
});

PlaceTypeSchema.virtual('places', {
    ref: 'places',
    localField: '_id',
    foreignField: 'types',
    justOne: false
});

PlaceTypeSchema.methods.supersave = async function () {
    log("save PlaceType");
    return await this.save();
};

PlaceTypeSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");

    objectHelper.load(this, newDoc);
    log("update PlaceType");
    return await this.save();
};
PlaceTypeSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

module.exports = mongoose.model("PlaceType", PlaceTypeSchema);

let Place = require("./Place");
let PlaceTypeMultilang = require("./PlaceTypeMultilang");
PlaceTypeSchema.pre("remove", async function (next) {
    try {
        let placeTypeMultilangs = await PlaceTypeMultilang.find({placeType: this._id});
        for (const placeTypeMultilang of placeTypeMultilangs) {
            await placeTypeMultilang.remove();
        }
        await Place.update(
            {types: this._id},
            {$pull: {types: this._id}},
            {multi: true, runValidators: true, context: "query"});
        log("remove PlaceType");
        return next();
    } catch (e) {
        return next(e);
    }
});