let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date(),
    },
    seen: {
        type: Boolean,
        default: false
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required:true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    }
});

MessageSchema.methods.supersave = async function () {
    let Client = require('./Client');

    let sender = await Client.findById(this.sender);
    let receiver = await Client.findById(this.receiver);

    if (!sender || !receiver) {
        throw new Error('Not found related model Client!');
    }
    log('save Message');
    return await this.save();
};

module.exports = mongoose.model('Message', MessageSchema);


MessageSchema.pre("remove", async function (next) {
    log('remove Message');
    return next();
});