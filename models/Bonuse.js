let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let BonuseSchema = new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'BonuseMultilang'
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
    },
}, {
    discriminatorKey: 'kind'
});

module.exports = Promo.discriminator('Bonuse', BonuseSchema);

let Multilang = require('./BonuseMultilang');

BonuseSchema.pre('remove', async function (next) {
    try {
        let multilangs = await Multilang.find({bonuse: this._id});
        multilangs.forEach(async function (multilang) {
            return await multilang.remove();
        });
        return next();
    } catch (e) {
        return next(e);
    }
});
BonuseSchema.pre('save', async function (next) {
    let self = this;
    try {
        let multilangs = await Multilang.find({_id: this.multilang});
        this.multilangs = [];
        if (multilangs) {
            multilangs.forEach(function (multilang) {
                self.multilangs.push(multilang._id);
            });
            multilangs.forEach(async function (multilang) {
                if (multilang.bonuse) {
                    return self.multilang.splice(self.multilang.indexOf(multilang._id), 1);
                } else {
                    return await Multilang.findByIdAndUpdate(multilang._id, {bonuse: self}, {
                        runValidators: true,
                        context: 'query'
                    });
                }
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});