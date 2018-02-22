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
module.exports = Multilang.discriminator('NewsMultilang', NewsMultilangSchema);

let Promo = require('./Promo');
NewsMultilangSchema.pre('remove', async function (next) {
    await Promo.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});
NewsMultilangSchema.pre('save', async function (next) {
    let promo = await Promo.findById(this.news);
    if (promo) {
        promo.multilang.push(this);
        promo.save();
        next();
    }
    let msg = 'Not found model:';
    if (!promo){
        msg += 'News ';
    }
    next(new Error(msg));
});