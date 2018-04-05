let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    actual: {
        type: Boolean,
        default: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
}, {
    timestamps: true,
});
TopPlaceSchema.statics.superfind = async function (params) {
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
TopPlaceSchema.methods.supersave = async function () {
    let Place = require('./Place');

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    }
    log("save TopPlace");
    return await this.save();
};
TopPlaceSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    if (newDoc.place) {
        throw new Error('Can`t update relations!');
    }
    objectHelper.load(this, newDoc);
    log("update TopPlace");
    return await this.save();
};

module.exports = mongoose.model('TopPlace', TopPlaceSchema);

TopPlaceSchema.pre("remove", async function (next) {
    log('remove TopPlace');
    return next();
});