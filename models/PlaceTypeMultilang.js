let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceTypeMultilangSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    placeType : {
        type : Schema.Types.ObjectId,
        ref: 'PlaceType',
        required:true
    },
}, {
    discriminatorKey: 'kind'
});
PlaceTypeMultilangSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
PlaceTypeMultilangSchema.methods.supersave = async function () {
    let PlaceType = require('./PlaceType');
    let Lang = require('./Lang');

    let placeType = await PlaceType.findById(this.placeType);
    let lang = await Lang.findById(this.lang);

    if (!placeType && this.placeType) {
        throw new Error('Not found related model PlaceType!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }
    log("save Multilang");
    return await this.save();
};
PlaceTypeMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.placeType) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.hasOwnProperty('lang')) {
        let lang = await Lang.count({_id: newDoc.lang});
        if (!lang)
            throw new Error('Not found related model Lang!');
    }
    objectHelper.load(this, newDoc);
    log("update Multilang");
    return await this.save();
};

module.exports = Multilang.discriminator('PlaceTypeMultilang', PlaceTypeMultilangSchema);