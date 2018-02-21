let Place = require('./Place');
let Client = require('./Client');

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

ComplaintSchema.pre('remove', function (next) {
    try {
        Client.update(
            {complaints: this._id},
            {$pull: {complaints: this._id}},
            {multi: true})
            .exec();
        Place.update(
            {complaints: this._id},
            {$pull: {complaints: this._id}},
            {multi: true})
            .exec();
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
});


module.exports = mongoose.model('Complaint', ComplaintSchema);