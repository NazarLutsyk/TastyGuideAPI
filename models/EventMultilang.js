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
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('EventMultilang', EventMultilangSchema);

let Promo = require('./Event');
EventMultilangSchema.pre('remove', async function (next) {
    try {
        await Promo.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true, runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
EventMultilangSchema.pre('save', async function (next) {
    try {
        let promo = await Promo.findById(this.event);
        this.event = promo ? promo._id : null;
        if (promo && promo.multilang.indexOf(this._id) == -1) {
            await Promo.findByIdAndUpdate(promo._id,{$push : {multilang : this}},{runValidators: true,context:'query'});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});