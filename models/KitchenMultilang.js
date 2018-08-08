let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let Multilang = require("./Multilang");

let KitchenMultilang = new Schema({
    name: {
        type: String,
        required: true
    },
    kitchen: {
        type: Schema.Types.ObjectId,
        ref: "kitchen",
        required: true
    },
}, {
    discriminatorKey: "kind",
});
KitchenMultilang.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
KitchenMultilang.methods.supersave = async function () {
    let Kitchen = require("./Kitchen");
    let Lang = require("./Lang");

    let kitchen = await Kitchen.findById(this.kitchen);
    let lang = await Lang.findById(this.lang);

    if (!kitchen && this.kitchen) {
        throw new Error("Not found related model Kitchen!");
    }
    if (!lang && this.lang) {
        throw new Error("Not found related model Lang!");
    }
    log("save Multilang");
    return await this.save();
};
KitchenMultilang.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    let Lang = require("./Lang");

    if (newDoc.kitchen) {
        throw new Error("Can`t update relations!");
    }
    if (newDoc.hasOwnProperty("lang")) {
        let lang = await Lang.count({_id: newDoc.lang});
        if (!lang)
            throw new Error("Not found related model Lang!");
    }
    objectHelper.load(this, newDoc);
    log("update Multilang");
    return await this.save();
};

module.exports = Multilang.discriminator("KitchenMultilang", KitchenMultilang);