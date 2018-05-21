let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ComplaintSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place",
        required: true
    }
}, {
    timestamps: true,
    toJSON: {virtuals:true, getters: true},
    toObject: {virtuals:true, getters: true},
});

ComplaintSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

ComplaintSchema.methods.supersave = async function () {
    let Place = require("./Place");
    let Client = require("./Client");

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);

    if (!client) {
        throw new Error("Not found related model Client!");
    }
    if (!place) {
        throw new Error("Not found related model Place!");
    }
    log("save Complaint");
    return await this.save();
};

ComplaintSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");

    if (newDoc.place || newDoc.client) {
        throw new Error("Can`t update relations!");
    }
    objectHelper.load(this, newDoc);
    log("update Complaint");
    return await this.save();
};

module.exports = mongoose.model("Complaint", ComplaintSchema);

ComplaintSchema.pre("remove", async function (next) {
    log("remove Complaint");
    return next();
});
