let mongoose = require('mongoose');
let path = require('path');

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
            message: 'Min avaragePrive eq 0'
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
    images: [String],
    types: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceType',
    }],
    hashTags: [{
        type: Schema.Types.ObjectId,
        ref: 'HashTag'
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

PlaceSchema.statics.loadAsyncValues = async function (docs) {
    let Rating = require('./Rating');
    if (docs) {
        if (!Array.isArray(docs))
            docs = [docs];
        for (let doc of docs) {
            let rating = await Rating.aggregate([
                {$match: {place: doc._id}},
                {$group: {_id: doc._id, avg: {$avg: '$value'}}}
            ]);
            if (rating && rating.length > 0)
                doc.rating = rating[0].avg;
            else
                doc.rating = 0;
        }
    }
};


PlaceSchema.methods.supersave = async function () {
    let PlaceType = require('./PlaceType');
    let HashTag = require('./HashTag');

    let placeTypeExists = await PlaceType.count({_id: this.types});
    let hashTagExists = await HashTag.count({_id: this.hashTags});

    if ((hashTagExists === 0 && this.hashTags.length !== 0) || (hashTagExists !== this.hashTags.length)) {
        throw new Error('Not found related model HashTag!');
    }
    if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== this.types.length)) {
        throw new Error('Not found related model PlaceType!');
    }

    return await this.save();
};

PlaceSchema.methods.superupdate = async function (newDoc) {

    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let fileHelper = require(global.paths.HELPERS + '/fileHelper');
    let PlaceType = require('./PlaceType');
    let HashTag = require('./HashTag');

    let placeTypeExists = await PlaceType.count({_id: newDoc.types});
    let hashTagExists = await HashTag.count({_id: newDoc.hashTags});


    if ((hashTagExists === 0 && this.hashTags.length !== 0) || (hashTagExists !== this.hashTags.length)) {
        throw new Error('Not found related model HashTag!');
    }
    if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== this.types.length)) {
        throw new Error('Not found related model PlaceType!');
    }
    if (newDoc.images) {
        for (let i = 0; i < this.images.length; i++) {
            let oldImage = this.images[i];
            if (newDoc.images.indexOf(oldImage) === -1) {
                let toDelete = global.paths.PUBLIC + "/upload/place/" + oldImage;
                fileHelper.deleteFiles(toDelete);
            }
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('Place', PlaceSchema);

let Complaint = require('./Complaint');
let DrinkApplication = require('./DrinkApplication');
let Rating = require('./Rating');
let Department = require('./Department');
let TopPlace = require('./TopPlace');
let Day = require('./Day');
let Promo = require('./Promo');
let HashTag = require('./HashTag');
let Multilang = require('./PlaceMultilang');
let Client = require('./Client');
PlaceSchema.pre('remove', async function (next) {
    try {
        let complaints = await Complaint.remove({place: this._id});
        let drinkApplications = await DrinkApplication.remove({place: this._id});
        let ratings = await Rating.remove({place: this._id});
        let departments = await Department.remove({place: this._id});
        let topPlaces = await TopPlace.remove({place: this._id});
        let days = await Day.remove({place: this._id});
        let promos = await Promo.remove({place: this._id});
        let multilangs = await Multilang.remove({place: this._id});
        let fileHelper = require(global.paths.HELPERS + '/fileHelper');

        await Client.update(
            {favoritePlaces: this._id},
            {$pull: {favoritePlaces: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        if (this.images.length > 0) {
            for (let i = 0; i < this.images.length; i++) {
                let image = this.images[i];
                let toDelete = global.paths.PUBLIC + "/upload/place/" + image;
                fileHelper.deleteFiles(toDelete);
            }
        }
        return next();
    } catch (e) {
        return next(e);
    }
});