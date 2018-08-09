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
    site: String,
    averagePrice: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    allowed: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
    },
    location: {
        lat: {
            type: Number,
            default: 0
        },
        lng: {
            type: Number,
            default: 0
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
    images: {
        type: [String],
    },
    days: {
        1: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
        2: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
        3: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
        4: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
        5: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
        6: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
        7: {
            start: {
                type: String,
            },
            end: {
                type: String,
            }
        },
    },
    types: [{
        type: Schema.Types.ObjectId,
        ref: "PlaceType",
    }],
    topCategories: [{
        type: Schema.Types.ObjectId,
        ref: "TopCategory",
    }],
    kitchens: [{
        type: Schema.Types.ObjectId,
        ref: "kitchen",
    }],
    city: {
        type: Schema.Types.ObjectId,
        ref: "City",
    },
    hashTags: [String],
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},

});

PlaceSchema.virtual("statistic", {
    ref: "Review",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("multilang", {
    ref: "PlaceMultilang",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("tops", {
    ref: "TopPlace",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("news", {
    ref: "News",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("bonuses", {
    ref: "Bonuse",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("complaints", {
    ref: "Complaint",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("drinkApplications", {
    ref: "DrinkApplication",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("ratings", {
    ref: "Rating",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.virtual("departments", {
    ref: "Department",
    localField: "_id",
    foreignField: "place",
    justOne: false
});

PlaceSchema.statics.notUpdatable = function () {
    return ["rating", "reviews", "allowed", "topCategories", "averagePrice"];
};
PlaceSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

PlaceSchema.methods.supersave = async function () {
    let PlaceType = require("./PlaceType");
    let TopCategory = require("./TopCategory");
    let Kitchen = require("./Kitchen");
    let City = require("./City");

    let placeTypeExists = await PlaceType.count({_id: this.types});
    let topCategoryExists = await TopCategory.count({_id: this.topCategories});
    let kithcenExists = await Kitchen.count({_id: this.kitchens});
    let cityExists = await City.count({_id: this.city});

    if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== this.types.length)) {
        throw new Error("Not found related model PlaceType!");
    }
    if ((kithcenExists === 0 && this.kitchens.length !== 0) || (kithcenExists !== this.kitchens.length)) {
        throw new Error("Not found related model Kitchen!");
    }
    if ((topCategoryExists === 0 && this.topCategories.length !== 0) || (topCategoryExists !== this.topCategories.length)) {
        throw new Error("Not found related model TopCategory!");
    }
    if (cityExists === 0 && this.city) {
        throw new Error("Not found related model City!");
    }
    log("save Place");
    return await this.save();
};

PlaceSchema.methods.superupdate = async function (newDoc) {

    let objectHelper = require("../helpers/objectHelper");
    let fileHelper = require("../helpers/fileHelper");
    let PlaceType = require("./PlaceType");
    let TopCategory = require("./TopCategory");
    let Kitchen = require("./Kitchen");
    let City = require("./City");
    let path = require("path");

    let placeTypeExists = await PlaceType.count({_id: newDoc.types});
    let topCategoryExists = await TopCategory.count({_id: newDoc.topCategories});
    let kithcenExists = await Kitchen.count({_id: newDoc.kitchens});
    let cityExists = await City.count({_id: newDoc.city});

    if (newDoc.types && newDoc.types.length > 0) {
        if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== newDoc.types.length)) {
            throw new Error("Not found related model PlaceType!");
        }
    }
    if (newDoc.kitchens && newDoc.kitchens.length > 0) {
        if ((kithcenExists === 0 && this.kitchens.length !== 0) || (kithcenExists !== newDoc.kitchens.length)) {
            throw new Error("Not found related model Kitchen!");
        }
    }
    if (newDoc.topCategories && newDoc.topCategories.length > 0) {
        if ((topCategoryExists === 0 && this.topCategories.length !== 0) || (topCategoryExists !== newDoc.topCategories.length)) {
            throw new Error("Not found related model TopCategory!");
        }
    }
    if (newDoc.city && cityExists === 0) {
        throw new Error("Not found related model City!");
    }
    if (newDoc.images) {
        for (let i = 0; i < this.images.length; i++) {
            let oldImage = this.images[i];
            if (newDoc.images.indexOf(oldImage) === -1) {
                let toDelete = path.join(__dirname, "../public", oldImage);
                fileHelper.deleteFiles(toDelete);
            }
        }
    }
    if (typeof(newDoc.avatar) !== "undefined") {
        let toDelete = path.join(__dirname, "../public", this.avatar);
        fileHelper.deleteFiles(toDelete);
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
let Promo = require("./Promo");
let Multilang = require("./PlaceMultilang");
let Client = require("./Client");
let path = require("path");
PlaceSchema.pre("remove", async function (next) {
    console.log("remove place");
    try {
        let complaints = await Complaint.find({place: this._id});
        let drinkApplications = await DrinkApplication.find({place: this._id});
        let ratings = await Rating.find({place: this._id});
        let departments = await Department.find({place: this._id});
        let topPlaces = await TopPlace.find({place: this._id});
        let promos = await Promo.find({place: this._id});
        let multilangs = await Multilang.find({place: this._id});
        for (const complaint of complaints) {
            await complaint.remove();
        }
        for (const drinkApplication of drinkApplications) {
            await drinkApplication.remove();
        }
        for (const rating of ratings) {
            await rating.remove();
        }
        for (const department of departments) {
            await department.remove();
        }
        for (const topPlace of topPlaces) {
            await topPlace.remove();
        }
        for (const promo of promos) {
            await promo.remove();
        }
        for (const multilang of multilangs) {
            await multilang.remove();
        }

        let fileHelper = require("../helpers/fileHelper");
        await Client.update(
            {favoritePlaces: this._id},
            {$pull: {favoritePlaces: this._id}},
            {multi: true, runValidators: true, context: "query"});
        if (this.images.length > 0) {
            for (let i = 0; i < this.images.length; i++) {
                let image = this.images[i];
                let toDelete = path.join(__dirname, "../public", image);
                fileHelper.deleteFiles(toDelete);
            }
        }
        if (this.avatar) {
            let toDelete = path.join(__dirname, "../public", this.avatar);
            fileHelper.deleteFiles(toDelete);
        }
        log("remove Place");
        return next();
    } catch (e) {
        return next(e);
    }
});