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
    news: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});

NewsMultilangSchema.methods.supersave = async function () {
    let News = require('./News');

    let news = await News.findById(this.news);
    let lang = await Lang.findById(this.lang);

    if (!news && this.news) {
        throw new Error('Not found related model News!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }

    return await this.save();
};
NewsMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.news || newDoc.lang) {
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

module.exports = Multilang.discriminator('NewsMultilang', NewsMultilangSchema);