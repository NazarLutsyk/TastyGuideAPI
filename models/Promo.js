let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place",
        required: true
    },
    image: String,
}, {
    timestamps: true,
    discriminatorKey: "kind"
});
module.exports = mongoose.model("Promo", PromoSchema);
PromoSchema.methods.supersave = async function () {
    let Place = require("./Place");
    let Client = require("./Client");

    let place = await Place.findById(this.place);
    let department = await Client.findById(this.author);

    if (!place && this.place) {
        throw new Error("Not found related model Place!");
    }
    if (!department && this.author) {
        throw new Error("Not found related model Client!");
    }
    log("save Promo");
    return await this.save();
};

PromoSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    let fileHelper = require("../helpers/fileHelper");
    let path = require("path");


    if (newDoc.author || newDoc.place) {
        throw new Error("Can`t update relations!");
    }
    if ((newDoc.image !== this.image) && this.image) {
        let toDelete = path.join(__dirname, "../public", "upload", "promo", this.image);
        fileHelper.deleteFiles(toDelete);
    }
    objectHelper.load(this, newDoc);
    log("update Promo");
    return await this.save();
};
PromoSchema.pre("remove", async function (next) {
    let fileHelper = require("../helpers/fileHelper");
    let path = require("path");
    try {
        if (this.image) {
            let toDelete = path.join(__dirname, "../public", "upload", "promo", this.image);
            fileHelper.deleteFiles(toDelete);
        }
        log("remove Promo");
        return next();
    } catch (e) {
        return next(e);
    }
});
