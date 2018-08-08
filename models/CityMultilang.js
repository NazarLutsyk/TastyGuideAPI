let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let CityMultilangSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    city : {
        type : Schema.Types.ObjectId,
        ref: 'City',
        required:true
    },
}, {
    discriminatorKey: 'kind'
});
CityMultilangSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
CityMultilangSchema.methods.supersave = async function () {
    let City = require('./City');
    let Lang = require('./Lang');

    let city = await City.findById(this.city);
    let lang = await Lang.findById(this.lang);

    if (!city && this.city) {
        throw new Error('Not found related model City!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }
    log("save Multilang");
    return await this.save();
};
CityMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.city) {
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

module.exports = Multilang.discriminator('CityMultilang', CityMultilangSchema);