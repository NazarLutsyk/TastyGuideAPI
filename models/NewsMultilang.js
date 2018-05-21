let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let NewsMultilangSchema = new Schema({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    promo: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});

NewsMultilangSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

NewsMultilangSchema.methods.supersave = async function () {
    let News = require('./News');
    let Lang = require('./Lang');

    let promo = await News.findById(this.promo);
    let lang = await Lang.findById(this.lang);

    if (!promo && this.promo) {
        throw new Error('Not found related model News!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }
    log('save Multilang');
    return await this.save();
};
NewsMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.promo) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.hasOwnProperty('lang')) {
        let lang = await Lang.count({_id: newDoc.lang});
        if (!lang)
            throw new Error('Not found related model Lang!');
    }
    objectHelper.load(this, newDoc);
    log('update Multilang');
    return await this.save();
};

module.exports = Multilang.discriminator('NewsMultilang', NewsMultilangSchema);
