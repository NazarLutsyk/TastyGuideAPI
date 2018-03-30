let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 5;
            },
            message: 'Value[min = 0,max = 5]'
        }
    },
    comment: String,
    price: {
        type: Number
    },
    client: {
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

RatingSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Client = require('./Client');

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);

    if (!client) {
        throw new Error('Not found related model Client!');
    }
    if (!place) {
        throw new Error('Not found related model Place!');
    }
    log("save Rating");
    return await this.save();
};

RatingSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    if (newDoc.place || newDoc.client) {
        throw new Error('Can`t update relations!');
    }
    objectHelper.load(this, newDoc);
    log("update Rating");
    return await this.save();
};

module.exports = mongoose.model('Rating', RatingSchema);

RatingSchema.pre("remove", async function (next) {
    log('remove Rating');
    return next();
});