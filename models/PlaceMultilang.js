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
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});

PlaceMultilangSchema.methods.supersave = async function () {
    let Place = require('./Place');

    let place = await Place.findById(this.place);
    let lang = await Lang.findById(this.lang);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    }
    if (!lang && this.lang) {
        throw new Error('Not found related model Lang!');
    }
    return await this.save();
};
PlaceMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
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
    return await this.save();
};

module.exports = Multilang.discriminator('PlaceMultilang', PlaceMultilangSchema);
