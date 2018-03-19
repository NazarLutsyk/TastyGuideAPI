let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ComplaintSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    }
}, {
    timestamps: true,
});

ComplaintSchema.methods.supersave = async function () {
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
            await Client.findByIdAndUpdate(client._id, {$push: {complaints: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
        if (place) {
            await Place.findByIdAndUpdate(place._id, {$push: {complaints: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
    }
    return await this.save();
};

ComplaintSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');
    let Client = require('./Client');

    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {complaints: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {complaints: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.client && newDoc.client != this.client) {
        let newClient = await Client.findById(newDoc.client);
        if (newClient) {
            await Client.findByIdAndUpdate(this.client, {$pull: {complaints: this._id}}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
            await Client.update(
                {_id: newClient._id},
                {$addToSet: {complaints: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Client!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};


module.exports = mongoose.model('Complaint', ComplaintSchema);

let Place = require('./Place');
let Client = require('./Client');
ComplaintSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {complaints: this._id},
            {$pull: {complaints: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Place.update(
            {complaints: this._id},
            {$pull: {complaints: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});



