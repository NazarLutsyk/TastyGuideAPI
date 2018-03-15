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

EventMultilangSchema.methods.supersave = async function () {
    let Event = require('./Event');

    let event = await Event.findById(this.event);

    if (!event && this.event) {
        throw new Error('Not found related model Event!');
    } else if (event) {
        await Event.findByIdAndUpdate(event._id, {$push: {multilang: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
EventMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Event = require('./Event');

    if (newDoc.event && newDoc.event != this.event) {
        let newPlace = await Event.findById(newDoc.event);
        if (newPlace) {
            await Event.findByIdAndUpdate(this.event, {$pull: {multilang: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Event.update(
                {_id: newPlace._id},
                {$addToSet: {multilang: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Event!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = Multilang.discriminator('EventMultilang', EventMultilangSchema);

let Promo = require('./Event');
EventMultilangSchema.pre('remove', async function (next) {
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