let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let EventMultilangSchema = new Schema({
    header : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    event : {
        type : Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('EventMultilang', EventMultilangSchema);

let Promo = require('./Promo');
EventMultilangSchema.pre('remove',async function (next) {
    await Promo.update(
        {multilang: this._id},
        {$pull: {multilang: this._id}},
        {multi: true});
    next();
});
EventMultilangSchema.pre('save', async function (next) {
    let promo = await Promo.findById(this.event);
    if (promo) {
        promo.multilang.push(this);
        promo.save();
        next();
    }
    let msg = 'Not found model:';
    if (!promo){
        msg += 'Event ';
    }
    next(new Error(msg));
});