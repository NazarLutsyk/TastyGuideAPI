let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let BonuseMultilangSchema = new Schema({
    header : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    conditions : {
        type : String,
        required : true
    },
    bonuse : {
        type : Schema.Types.ObjectId,
        ref : 'Bonuse',
        required : true
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('BonuseMultilang', BonuseMultilangSchema);

let Promo = require('./Promo');
BonuseMultilangSchema.pre('remove',async function (next) {
    await Promo.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});
BonuseMultilangSchema.pre('save', async function (next) {
    let promo = await Promo.findById(this.bonuse);
    if (promo) {
        promo.multilang.push(this);
        promo.save();
        next();
    }
    let msg = 'Not found model:';
    if (!promo){
        msg += 'Bonuse ';
    }
    next(new Error(msg));
});