let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let NewsSchema = new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'NewsMultilang'
    }],
}, {
    discriminatorKey: 'kind'
});

module.exports = Promo.discriminator('News', NewsSchema);

let Multilang = require('./NewsMultilang');

NewsSchema.pre('remove', async function (next) {
    try {
        let multilangs = await Multilang.find({news: this._id});
        multilangs.forEach(async function (multilang) {
            return await multilang.remove();
        });
        return next();
    } catch (e) {
        return next(e);
    }
});
NewsSchema.pre('save', async function (next) {
    let self = this;
    try {
        let multilangs = await Multilang.find({_id: this.multilang});
        this.multilangs = [];
        if (multilangs) {
            multilangs.forEach(function (multilang) {
                self.multilang.push(multilang._id);
            });
            multilangs.forEach(async function (multilang) {
                if (multilang.news) {
                    return self.multilang.splice(self.multilang.indexOf(multilang._id), 1);
                } else {
                    return await Multilang.findByIdAndUpdate(multilang._id, {news: self});
                }
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});