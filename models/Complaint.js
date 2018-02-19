let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ComplaintSchema = new Schema({
    value: String,
    client: {
        type: Schema.Types.ObjectId,
        rel: 'Client'
    },
    place: {
        type: Schema.Types.ObjectId,
        rel: 'Place'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Complaint', ComplaintSchema);