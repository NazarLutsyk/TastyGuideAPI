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
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required : true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required : true
    },
});
module.exports = mongoose.model('Message', MessageSchema);
