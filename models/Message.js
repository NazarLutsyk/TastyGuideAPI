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
MessageSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    let {target, fetch} = params;
    let res = [];
    let listOfMainModels = await universalFind(this, target);
    if (fetch && listOfMainModels && !target.aggregate) {
        for (let mainModel of listOfMainModels) {
            let mainModelToResponse = mainModel.toObject();
            if (mainModel._id) {
                for (let fetchModel of fetch) {
                    let fetchModelName = Object.keys(fetchModel)[0];
                    //todo
                    if (fetchModelName.toLowerCase() === "sender") {
                        fetchModel[fetchModelName].query._id = mainModel.sender.toString();
                        mainModelToResponse.sender = (await universalFind(require("./Client"), fetchModel[fetchModelName]))[0];
                    }
                    if (fetchModelName.toLowerCase() === "receiver") {
                        fetchModel[fetchModelName].query._id = mainModel.receiver.toString();
                        mainModelToResponse.receiver = (await universalFind(require("./Client"), fetchModel[fetchModelName]))[0];
                    }
                }
            }
            res.push(mainModelToResponse);
        }
    }else if(target.aggregate){
        res.push(...listOfMainModels);
    }
    return res;
};
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