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
    await Client.update(
        {complaints: this._id},
        {$pull: {complaints: this._id}},
        {multi: true});
    await Place.update(
        {complaints: this._id},
        {$pull: {complaints: this._id}},
        {multi: true});
    next();
});
ComplaintSchema.pre('save', async function (next) {
    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);
    if (client && place) {
        client.complaints.push(this);
        place.complaints.push(this);
        await client.save();
        await place.save();
    }
    next();
    // let msg = 'Not found model:';
    // if (!client){
    //     msg += 'Client ';
    // }
    // if (!place){
    //     msg += 'Place';
    // }
    // next(new Error(msg));
});


