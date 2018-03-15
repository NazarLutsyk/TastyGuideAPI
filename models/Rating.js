let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 5;
            },
            message: 'Value[min = 0,max = 5]'
        }
    },
    comment: String,
    price: {
        type: Number
    },
    client: {
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

RatingSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Client = require('./Client');

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);

    if (!client && this.client) {
        throw new Error('Not found related model Client!');
    }
    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else {
        if (client) {
            await Client.findByIdAndUpdate(client._id, {$push: {ratings: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
        if (place) {
            await Place.findByIdAndUpdate(place._id, {$push: {ratings: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
    }
    return await this.save();
};

RatingSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');
    let Client = require('./Client');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {ratings: this._id}},{runValidators: true, context: 'query'});
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {ratings: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.client && newDoc.client != this.client) {
        let newClient = await Client.findById(newDoc.client);
        if (newClient) {
            await Client.findByIdAndUpdate(this.client, {$pull: {ratings: this._id}},{runValidators: true, context: 'query'});
            await Client.update(
                {_id: newClient._id},
                {$addToSet: {ratings: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Client!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};


module.exports = mongoose.model('Rating', RatingSchema);

let Place = require('./Place');
let Client = require('./Client');
RatingSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {ratings: this._id},
            {$pull: {ratings: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Place.update(
            {ratings: this._id},
            {$pull: {ratings: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});