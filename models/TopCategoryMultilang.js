let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let Multilang = require("./Multilang");

let TopCategoryMultilangSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    topCategory: {
        type: Schema.Types.ObjectId,
        ref: "TopCategory"
    }
}, {
    discriminatorKey: "kind",
});

TopCategoryMultilangSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

TopCategoryMultilangSchema.methods.supersave = async function () {
    let TopCategoty = require("./TopCategory");
    let Lang = require("./Lang");

    let topCategory = await TopCategoty.findById(this.topCategory);
    let lang = await Lang.findById(this.lang);

    if (!topCategory && this.topCategory) {
        throw new Error("Not found related model TopCategoty!");
    }
    if (!lang && this.lang) {
        throw new Error("Not found related model Lang!");
    }
    log("save Multilang");
    return await this.save();
};

TopCategoryMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    let Lang = require("./Lang");

    if (newDoc.topCategory) {
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

module.exports = Multilang.discriminator("TopCategoryMultilang", TopCategoryMultilangSchema);