let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    date : {
        type : Date,
        default : Date.now(),
        required : true
    },
    seen : {
        type: Boolean,
        default: false
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    }
});
module.exports = mongoose.model('Message', MessageSchema);
