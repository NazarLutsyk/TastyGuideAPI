let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let EventMultilangSchema = new Schema({
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
        ref: 'Event',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});

EventMultilangSchema.methods.supersave = async function () {
    let Event = require('./Event');
    let Lang = require('./Lang');

    let promo = await Event.findById(this.promo);
    let lang = await Lang.findById(this.lang);

    if (!promo) {
        throw new Error('Not found related model Event!');
    }
    if (!lang) {
        throw new Error("Not found related model Lang!");
    }
    log('save Multilang');
    return await this.save();
};
EventMultilangSchema.methods.superupdate = async function (newDoc) {
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

module.exports = Multilang.discriminator('EventMultilang', EventMultilangSchema);