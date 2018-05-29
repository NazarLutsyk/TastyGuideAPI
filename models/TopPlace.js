let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    actual: {
        type: Boolean,
        default: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place",
        required: true
    },
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},
});
TopPlaceSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
TopPlaceSchema.methods.supersave = async function () {
    let Place = require("./Place");

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error("Not found related model Place!");
    }

    let alreadyExists = await topPlaceModel.count({place: place._id, actual: true});
    if (alreadyExists) {
        throw new Error("Already exists!");
    } else {
        log("save TopPlace");
        return await this.save();
    }
};
TopPlaceSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    if (newDoc.place) {
        throw new Error("Can`t update relations!");
    }
    let alreadyExists = await topPlaceModel.count({place: newDoc._id, actual: true});
    if (newDoc.actual && newDoc.actual == true && alreadyExists) {
        throw new Error("Already exists!");
    } else {
        objectHelper.load(this, newDoc);
        log("update TopPlace");
        return await this.save();
    }
};

let topPlaceModel = mongoose.model("TopPlace", TopPlaceSchema);
module.exports = topPlaceModel;

TopPlaceSchema.pre("remove", async function (next) {
    log("remove TopPlace");
    return next();
});