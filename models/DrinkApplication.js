let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DrinkApplicationSchema = new Schema({
    friends: {
        type: String,
        default: 'NONE'
    },
    goal: {
        type: String,
        default: 'NONE'
    },
    budged: {
        type: Number,
        default: 0,
        validate: {
            validator: function (budged) {
                return budged >= 0;
            },
            message: 'Min budget eq 0'
        }
    },
    date: {
        type: Date,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
}, {
    timestamps: true,
});

DrinkApplicationSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Client = require('./Client');

    let organizer = await Client.findById(this.organizer);
    let place = await Place.findById(this.place);

    if (!organizer && this.organizer) {
        throw new Error('Not found related model Client!');
    }
    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else {
        if (organizer) {
            await Client.findByIdAndUpdate(organizer._id, {$push: {drinkApplications: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
        if (place) {
            await Place.findByIdAndUpdate(place._id, {$push: {drinkApplications: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
    }
    return await this.save();
};

DrinkApplicationSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');
    let Client = require('./Client');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {drinkApplications: this._id}},{runValidators: true, context: 'query'});
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {drinkApplications: this._id}},{runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.organizer && newDoc.organizer != this.organizer) {
        let newClient = await Client.findById(newDoc.organizer);
        if (newClient) {
            await Client.findByIdAndUpdate(this.organizer, {$pull: {drinkApplications: this._id}},{runValidators: true, context: 'query'});
            await Client.update(
                {_id: newClient._id},
                {$addToSet: {drinkApplications: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Client!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save()
};

module.exports = mongoose.model('DrinkApplication', DrinkApplicationSchema);

let Place = require('./Place');
let Client = require('./Client');
DrinkApplicationSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Place.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});

