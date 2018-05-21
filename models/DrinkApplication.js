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
    toJSON: {virtuals:true, getters: true},
    toObject: {virtuals:true, getters: true},
});

DrinkApplicationSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
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