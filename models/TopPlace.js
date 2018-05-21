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
    toJSON: {virtuals:true, getters: true},
    toObject: {virtuals:true, getters: true},
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
    log("save TopPlace");
    return await this.save();
};
TopPlaceSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    if (newDoc.place) {
        throw new Error("Can`t update relations!");
    }
    objectHelper.load(this, newDoc);
    log("update TopPlace");
    return await this.save();
};

module.exports = mongoose.model("TopPlace", TopPlaceSchema);

TopPlaceSchema.pre("remove", async function (next) {
    log("remove TopPlace");
    return next();
});