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
PlaceTypeSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    let {target, fetch} = params;
    let res = [];
    let listOfMainModels = await universalFind(this, target);
    if (fetch && listOfMainModels && !target.aggregate) {
        for (let mainModel of listOfMainModels) {
            let mainModelToResponse = mainModel.toObject();
            if (mainModel._id) {
                for (let fetchModel of fetch) {
                    let fetchModelName = Object.keys(fetchModel)[0];
                    if (fetchModelName.toLowerCase() === "placetypemultilang") {
                        fetchModel[fetchModelName].query.placeType = mainModel._id.toString();
                        mainModelToResponse.multilang = await universalFind(require("./PlaceTypeMultilang"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "place") {
                        fetchModel[fetchModelName].query.types = mainModel._id.toString();
                        mainModelToResponse.place = await universalFind(require("./Place"), fetchModel[fetchModelName]);
                    }
                }
            }
            res.push(mainModelToResponse);
        }
    } else if (target.aggregate) {
        res.push(...listOfMainModels);
    }
    return res;
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