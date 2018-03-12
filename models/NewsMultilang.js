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
NewsMultilangSchema.pre('save', async function (next) {
    try {
        let promo = await Promo.findById(this.news);
        this.news = promo ? promo._id : null;
        if (promo && promo.multilang.indexOf(this._id) == -1) {
            return await Promo.findByIdAndUpdate(promo._id,{$push : {multilang : this}},{runValidators: true,context:'query'});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});