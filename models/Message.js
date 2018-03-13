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

let Client = require('./Client');
let Place = require('./Place');
MessageSchema.pre('save', async function (next) {
    try {
        let sender = await Client.findById(this.sender);
        let receiver = await Place.findById(this.receiver);
        if ((!sender && this.sender != null) &&
            (!receiver && this.receiver != null)) {
            return next(new Error('Not found related model!'));
        } else {
            return next();
        }
    } catch (e) {
        return next(e);
    }
});
