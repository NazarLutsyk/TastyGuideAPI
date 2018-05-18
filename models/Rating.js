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
RatingSchema.statics.superfind = async function (params) {
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
                        fetchModel[fetchModelName].query._id = mainModel.client.toString();
                        mainModelToResponse.client = (await universalFind(require("./Client"), fetchModel[fetchModelName]))[0];
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
RatingSchema.methods.supersave = async function (context) {
    let Place = require("./Place");
    let Client = require("./Client");

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);

    if (!client) {
        throw new Error("Not found related model Client!");
    }
    if (!place) {
        throw new Error("Not found related model Place!");
    }
    log("save Rating");
    let newRating = await this.save();

    let rating = await context.aggregate([
        {$match: {place: newRating.place}},
        {$group: {_id: newRating.place, avg: {$avg: "$value"}}}
    ]);
    let placeAvg = 0;
    if (rating && rating.length > 0)
        placeAvg = rating[0].avg;
    await Place.update({_id: newRating.place}, {rating: placeAvg});
    return rating;
};

RatingSchema.methods.superupdate = async function (newDoc,context) {
    let objectHelper = require('../helpers/objectHelper');
    let Place = require("./Place");

    if (newDoc.place || newDoc.client) {
        throw new Error('Can`t update relations!');
    }
    objectHelper.load(this, newDoc);
    log("update Rating");
    let newRating = await this.save();

    let rating = await context.aggregate([
        {$match: {place: newRating.place}},
        {$group: {_id: newRating.place, avg: {$avg: "$value"}}}
    ]);
    let placeAvg = 0;
    if (rating && rating.length > 0)
        placeAvg = rating[0].avg;

    await Place.update({_id: newRating.place}, {rating: placeAvg});
    return newRating;
};
let Model = mongoose.model('Rating', RatingSchema);
module.exports = Model;

RatingSchema.pre("remove", async function (next) {
    let Place = require("./Place");
    log('remove Rating');
    let rating = await Model.aggregate([
        {$match: {place: this.place, _id: {$ne : this._id}}},
        {$group: {_id: this.place, avg: {$avg: "$value"}}}
    ]);
    let placeAvg = 0;
    if (rating && rating.length > 0)
        placeAvg = rating[0].avg;
    await Place.update({_id: this.place.toString()}, {rating: placeAvg},{new: true, multiple: true});
    return next();
});