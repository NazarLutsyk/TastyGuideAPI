let mongoose = require("mongoose");


let Schema = mongoose.Schema;

let PlaceSchema = new Schema({
    phone: {
        type: String,
        match: /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/
    },
    email: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    averagePrice: {
        type: Number,
        default: 0,
        validate: {
            validator: function (averagePrice) {
                return averagePrice >= 0;
            },
            message: "Min avaragePrive eq 0"
        }
    },
    reviews: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
    },
    allowed: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String
    },
    location: {
        ltg: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    },
    features: {
        wifi: {
            type: Boolean,
            default: false
        },
        parking: {
            type: Boolean,
            default: false
        },
        vipRoom: {
            type: Boolean,
            default: false
        },
        karaoke: {
            type: Boolean,
            default: false
        }
    },
    topCategories: [String],
    images: [String],
    types: [{
        type: Schema.Types.ObjectId,
        ref: "PlaceType",
    }],
    hashTags: [{
        type: Schema.Types.ObjectId,
        ref: "HashTag"
    }],
}, {
    timestamps: true,
    toJSON: {
        getters: true,
    },
    toObject: {
        getters: true,
    }
});

PlaceSchema.statics.notUpdatable = function () {
    return ["rating", "reviews", "allowed", "topCategories"];
};
PlaceSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    let {target, fetch} = params;
    let res = [];
    let listOfMainModels = await universalFind(this, target);
    await this.loadAsyncValues(listOfMainModels);
    if (fetch && listOfMainModels && !target.aggregate) {
        for (let mainModel of listOfMainModels) {
            let mainModelToResponse = mainModel.toObject();
            if (mainModel._id) {
                for (let fetchModel of fetch) {
                    let fetchModelName = Object.keys(fetchModel)[0];
                    if (fetchModelName.toLowerCase() === "complaint") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.complaints = await universalFind(require("./Complaint"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "drinkapplication") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.drinkApplications = await universalFind(require("./DrinkApplication"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "rating") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.ratings = await universalFind(require("./Rating"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "department") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.departments = await universalFind(require("./Department"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "hashtag") {
                        fetchModel[fetchModelName].query._id = mainModel.hashTags;
                        mainModelToResponse.hashTags = await universalFind(require("./HashTag"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "topplace") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.tops = await universalFind(require("./TopPlace"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "placetype") {
                        fetchModel[fetchModelName].query._id = mainModel.types;
                        mainModelToResponse.types = (await universalFind(require("./PlaceType"), fetchModel[fetchModelName]))[0];
                    }
                    if (fetchModelName.toLowerCase() === "placemultilang") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.multilang = await universalFind(require("./PlaceMultilang"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "day") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.days = await universalFind(require("./Day"), fetchModel[fetchModelName]);
                    }
                    if (fetchModelName.toLowerCase() === "promo") {
                        fetchModel[fetchModelName].query.place = mainModel._id.toString();
                        mainModelToResponse.promos = await universalFind(require("./Promo"), fetchModel[fetchModelName]);
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
PlaceSchema.statics.loadAsyncValues = async function (docs) {
    let Rating = require("./Rating");
    if (docs) {
        if (!Array.isArray(docs))
            docs = [docs];
        log("load async values");
        for (let doc of docs) {
            let rating = await Rating.aggregate([
                {$match: {place: doc._id}},
                {$group: {_id: doc._id, avg: {$avg: "$value"}}}
            ]);
            if (rating && rating.length > 0)
                doc.rating = rating[0].avg;
            else
                doc.rating = 0;
        }
    }
};


PlaceSchema.methods.supersave = async function () {
    let PlaceType = require("./PlaceType");
    let HashTag = require("./HashTag");

    let placeTypeExists = await PlaceType.count({_id: this.types});
    let hashTagExists = await HashTag.count({_id: this.hashTags});

    if ((hashTagExists === 0 && this.hashTags.length !== 0) || (hashTagExists !== this.hashTags.length)) {
        throw new Error("Not found related model HashTag!");
    }
    if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== this.types.length)) {
        throw new Error("Not found related model PlaceType!");
    }
    log("save Place");
    return await this.save();
};

PlaceSchema.methods.superupdate = async function (newDoc) {

    let objectHelper = require("../helpers/objectHelper");
    let fileHelper = require("../helpers/fileHelper");
    let PlaceType = require("./PlaceType");
    let HashTag = require("./HashTag");
    let path = require("path");

    let placeTypeExists = await PlaceType.count({_id: newDoc.types});
    let hashTagExists = await HashTag.count({_id: newDoc.hashTags});


    if (newDoc.hashTags && newDoc.hashTags.length > 0) {
        if ((hashTagExists === 0 && this.hashTags.length !== 0) || (hashTagExists !== newDoc.hashTags.length)) {
            throw new Error("Not found related model HashTag!");
        }
    }
    if (newDoc.types && newDoc.types.length > 0) {
        if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== newDoc.types.length)) {
            throw new Error("Not found related model PlaceType!");
        }
    }
    if (newDoc.images) {
        for (let i = 0; i < this.images.length; i++) {
            let oldImage = this.images[i];
            if (newDoc.images.indexOf(oldImage) === -1) {
                let toDelete = path.join(__dirname, "../public", "upload", "place", oldImage);
                fileHelper.deleteFiles(toDelete);
            }
        }
    }
    objectHelper.load(this, newDoc);
    log("update Place");
    return await this.save();
};

module.exports = mongoose.model("Place", PlaceSchema);

let Complaint = require("./Complaint");
let DrinkApplication = require("./DrinkApplication");
let Rating = require("./Rating");
let Department = require("./Department");
let TopPlace = require("./TopPlace");
let Day = require("./Day");
let Promo = require("./Promo");
let HashTag = require("./HashTag");
let Multilang = require("./PlaceMultilang");
let Client = require("./Client");
let path = require("path");
PlaceSchema.pre("remove", async function (next) {
    try {
        let complaints = await Complaint.remove({place: this._id});
        let drinkApplications = await DrinkApplication.remove({place: this._id});
        let ratings = await Rating.remove({place: this._id});
        let departments = await Department.remove({place: this._id});
        let topPlaces = await TopPlace.remove({place: this._id});
        let days = await Day.remove({place: this._id});
        let promos = await Promo.remove({place: this._id});
        let multilangs = await Multilang.remove({place: this._id});
        let fileHelper = require("../helpers/fileHelper");

        await Client.update(
            {favoritePlaces: this._id},
            {$pull: {favoritePlaces: this._id}},
            {multi: true, runValidators: true, context: "query"});
        if (this.images.length > 0) {
            for (let i = 0; i < this.images.length; i++) {
                let image = this.images[i];
                let toDelete = path.join(__dirname, "../public", "upload", "place", image);
                fileHelper.deleteFiles(toDelete);
            }
        }
        log("remove Place");
        return next();
    } catch (e) {
        return next(e);
    }
});