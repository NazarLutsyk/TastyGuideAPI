let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let EventSchema = new Schema({
}, {
    discriminatorKey: 'kind'
});
module.exports = Promo.discriminator('Event', EventSchema);

let Multilang = require('./EventMultilang');
EventSchema.pre('remove', async function (next) {
    try {
        await Multilang.remove({event: this._id});
        return next();
    } catch (e) {
        return next(e);
    }
});