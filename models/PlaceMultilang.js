let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceMultilangSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        city: String,
        street: String,
        number: Number,
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});
PlaceMultilangSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
PlaceMultilangSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Lang = require('./Lang');

    let place = await Place.findById(this.place);
    let lang = await Lang.findById(this.lang);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    }
    if (!lang && this.lang) {
        throw new Error('Not found related model Lang!');
    }
    log('save Multilang');
    return await this.save();
};
PlaceMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.place) {
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

module.exports = Multilang.discriminator('PlaceMultilang', PlaceMultilangSchema);
