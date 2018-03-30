let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({}, {
    timestamps: true,
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

module.exports = mongoose.model("PlaceType", PlaceTypeSchema);

let Place = require("./Place");
let PlaceTypeMultilang = require("./PlaceTypeMultilang");
PlaceTypeSchema.pre("remove", async function (next) {
    try {
        await Place.update(
            {types: this._id},
            {$pull: {types: this._id}},
            {multi: true, runValidators: true, context: "query"});
        await PlaceTypeMultilang.remove({placeType: this._id});
        log("remove PlaceType");
        return next();
    } catch (e) {
        return next(e);
    }
});