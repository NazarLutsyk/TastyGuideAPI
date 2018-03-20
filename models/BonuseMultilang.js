let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let BonuseMultilangSchema = new Schema({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    conditions: {
        type: String,
        required: true
    },
    bonuse: {
        type: Schema.Types.ObjectId,
        ref: 'Bonuse',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});

BonuseMultilangSchema.methods.supersave = async function () {
    let Bonuse = require('./Bonuse');
    let Lang = require('./Lang');

    let bonuse = await Bonuse.findById(this.bonuse);
    let lang = await Lang.findById(this.lang);

    if (!bonuse && this.bonuse) {
        throw new Error('Not found related model Bonuse!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }
    return await this.save();
};
BonuseMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.bonuse || newDoc.lang) {
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

module.exports = Multilang.discriminator('BonuseMultilang', BonuseMultilangSchema);
