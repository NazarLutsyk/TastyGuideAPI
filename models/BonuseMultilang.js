let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let BonuseMultilangSchema = new Schema({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    conditions: {
        type: String,
        required: true
    },
    bonuse: {
        type: Schema.Types.ObjectId,
        ref: 'Bonuse',
    },
}, {
    discriminatorKey: 'kind'
});

BonuseMultilangSchema.methods.supersave = async function () {
    let Bonuse = require('./Bonuse');

    let bonuse = await Bonuse.findById(this.bonuse);

    if (!bonuse && this.bonuse) {
        throw new Error('Not found related model Bonuse!');
    } else if (bonuse) {
        await Bonuse.findByIdAndUpdate(bonuse._id, {$push: {multilang: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
BonuseMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Bonuse = require('./Bonuse');

    if (newDoc.bonuse && newDoc.bonuse != this.bonuse) {
        let newPlace = await Bonuse.findById(newDoc.bonuse);
        if (newPlace) {
            await Bonuse.findByIdAndUpdate(this.bonuse, {$pull: {multilang: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Bonuse.update(
                {_id: newPlace._id},
                {$addToSet: {multilang: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Bonuse!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = Multilang.discriminator('BonuseMultilang', BonuseMultilangSchema);

let Promo = require('./Bonuse');
BonuseMultilangSchema.pre('remove', async function (next) {
    try {
        await Promo.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});