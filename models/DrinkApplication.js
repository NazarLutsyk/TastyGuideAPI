let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DrinkApplicationSchema = new Schema({
    friends: {
        type: String,
        default: 'NONE'
    },
    goal: {
        type: String,
        default: 'NONE'
    },
    budged: {
        type: Number,
        default: 0,
        validate: {
            validator: function (budged) {
                return budged >= 0;
            },
            message: 'Min budget eq 0'
        }
    },
    date: {
        type: Date,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
}, {
    timestamps: true,
});

DrinkApplicationSchema.statics.superfind = async function (params) {
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
                    if (fetchModelName.toLowerCase() === "client") {
                        fetchModel[fetchModelName].query._id = mainModel.organizer.toString();
                        mainModelToResponse.organizer = (await universalFind(require("./Client"), fetchModel[fetchModelName]))[0];
                    }
                    if (fetchModelName.toLowerCase() === "place") {
                        fetchModel[fetchModelName].query._id = mainModel.place.toString();
                        mainModelToResponse.place = (await universalFind(require("./Place"), fetchModel[fetchModelName]))[0];
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

DrinkApplicationSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Client = require('./Client');

    let organizer = await Client.findById(this.organizer);
    let place = await Place.findById(this.place);

    if (!organizer) {
        throw new Error('Not found related model Client!');
    }
    if (!place) {
        throw new Error('Not found related model Place!');
    }
    log('save DrinkApp');
    return await this.save();
};

DrinkApplicationSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Place = require('./Place');

    if (newDoc.organizer) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.hasOwnProperty('place')) {
        let place = await Place.count({_id: newDoc.place});
        if (!place) {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    log('update DrinkApp');
    return await this.save()
};

module.exports = mongoose.model('DrinkApplication', DrinkApplicationSchema);


DrinkApplicationSchema.pre("remove", async function (next) {
    log('remove DrinkApp');
    return next();
});