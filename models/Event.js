let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let EventSchema = new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'EventMultilang'
    }],
}, {
    discriminatorKey: 'kind'
});
module.exports = Promo.discriminator('Event', EventSchema);

let Multilang = require('./EventMultilang');

EventSchema.pre('remove', async function (next) {
    try {
        let multilangs = await Multilang.find({event: this._id});
        multilangs.forEach(async function (multilang) {
            return await multilang.remove();
        });
        return next();
    } catch (e) {
        return next(e);
    }
});
EventSchema.pre('save', async function (next) {
    let self = this;
    try {
        let multilangs = await Multilang.find({_id: this.multilang});
        this.multilang = [];
        if (multilangs) {
            multilangs.forEach(function (multilang) {
                self.multilang.push(multilang._id);
            });
            multilangs.forEach(async function (multilang) {
                if (multilang.event) {
                    return self.multilang.splice(self.multilang.indexOf(multilang._id), 1);
                } else {
                    return await Multilang.findByIdAndUpdate(multilang._id, {event: self},{runValidators: true,context:'query'});
                }
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});