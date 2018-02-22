let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ComplaintSchema = new Schema({
    value: String,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('Complaint', ComplaintSchema);

let Place = require('./Place');
let Client = require('./Client');

ComplaintSchema.pre('remove',async function (next) {
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


