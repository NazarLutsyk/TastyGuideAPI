let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ReviewSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place"
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},
});


ReviewSchema.methods.supersave = async function () {
    log("save Review");
    return await this.save();
};

ReviewSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    objectHelper.load(this, newDoc);
    log("update Review");
    return await this.save();
};
ReviewSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

module.exports = mongoose.model("Review", ReviewSchema);

ReviewSchema.pre("remove", async function (next) {
    log("remove Review");
    return next();
});