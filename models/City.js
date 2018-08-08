let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CitySchema = new Schema({}, {
    timestamps: true,
    toJSON: {virtuals:true, getters: true},
    toObject: {virtuals:true, getters: true},
});

CitySchema.virtual('multilang', {
    ref: 'CityMultilang',
    localField: '_id',
    foreignField: 'city',
    justOne: false
});

CitySchema.virtual('places', {
    ref: 'places',
    localField: '_id',
    foreignField: 'city',
    justOne: false
});

CitySchema.methods.supersave = async function () {
    log("save City");
    return await this.save();
};

CitySchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");

    objectHelper.load(this, newDoc);
    log("update City");
    return await this.save();
};
CitySchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

module.exports = mongoose.model("City", CitySchema);

let Place = require("./Place");
let CityMultilang = require("./CityMultilang");
CitySchema.pre("remove", async function (next) {
    try {
        let cityMultilangs = await CityMultilang.find({city: this._id});
        for (const cityMultilang of cityMultilangs) {
            await cityMultilang.remove();
        }
        await Place.update(
            {city: this._id},
            {$unset: {city: ''}},
            {multi: true, runValidators: true, context: "query"});
        log("remove City");
        return next();
    } catch (e) {
        return next(e);
    }
});