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
module.exports = mongoose.model('Complaint', ComplaintSchema);

let Place = require('./Place');
let Client = require('./Client');

ComplaintSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {complaints: this._id},
            {$pull: {complaints: this._id}},
            {multi: true});
        await Place.update(
            {complaints: this._id},
            {$pull: {complaints: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
ComplaintSchema.pre('save', async function (next) {
    try {
        let client = await Client.findById(this.client);
        let place = await Place.findById(this.place);
        this.client = client ? client._id : '';
        this.place = place ? place._id : '';
        if (client && client.complaints.indexOf(this._id) == -1) {
            return await Client.findByIdAndUpdate(client._id, {$push : {complaints : this}});
        }
        if (place && place.complaints.indexOf(this._id) == -1) {
            return await Place.findByIdAndUpdate(place._id, {$push : {complaints : this}});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});


