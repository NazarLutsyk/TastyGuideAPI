let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    seen: {
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

MessageSchema.methods.supersave = async function () {
    let Client = require('./Client');

    let sender = await Client.findById(this.sender);
    let receiver = await Client.findById(this.receiver);

    if ((!sender && this.sender) || (!receiver && this.receiver)) {
        throw new Error('Not found related model Client!');
    }
    return await this.save();
};

module.exports = mongoose.model('Message', MessageSchema);

