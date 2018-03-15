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
    },
}, {
    discriminatorKey: 'kind'
});

NewsMultilangSchema.methods.supersave = async function () {
    let News = require('./News');

    let news = await News.findById(this.news);

    if (!news && this.news) {
        throw new Error('Not found related model News!');
    } else if (news) {
        await News.findByIdAndUpdate(news._id, {$push: {multilang: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
NewsMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let News = require('./News');

    if (newDoc.news && newDoc.news != this.news) {
        let newPlace = await News.findById(newDoc.news);
        if (newPlace) {
            await News.findByIdAndUpdate(this.news, {$pull: {multilang: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await News.update(
                {_id: newPlace._id},
                {$addToSet: {multilang: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model News!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = Multilang.discriminator('NewsMultilang', NewsMultilangSchema);

let Promo = require('./News');
NewsMultilangSchema.pre('remove', async function (next) {
    try {
        await Promo.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true,runValidators:true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});