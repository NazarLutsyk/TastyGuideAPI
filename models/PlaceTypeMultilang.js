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

PlaceTypeMultilangSchema.methods.supersave = async function () {
    let PlaceType = require('./PlaceType');

    let placeType = await PlaceType.findById(this.placeType);
    let lang = await Lang.findById(this.lang);

    if (!placeType && this.placeType) {
        throw new Error('Not found related model PlaceType!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }

    return await this.save();
};
PlaceTypeMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.placeType || newDoc.lang) {
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

module.exports = Multilang.discriminator('PlaceTypeMultilang', PlaceTypeMultilangSchema);