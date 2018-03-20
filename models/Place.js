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
    allowed: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    location: {
        ltg: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    },
    images: {
        type: [{
            type: String
        }]
    },
    boss: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    types: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'PlaceType',
        }],
    },
}, {
    timestamps: true,
});

PlaceSchema.methods.supersave = async function () {
    let PlaceType = require('./PlaceType');
    let Client = require('./Client');

    let client = await Client.findById(this.boss);
    let placeTypeExists = await PlaceType.count(this.types);

    if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== this.types.length)) {
        throw new Error('Not found related model PlaceType!');
    }
    return await this.save();
};

PlaceSchema.methods.superupdate = async function (newDoc) {

    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let fileHelper = require(global.paths.HELPERS + '/fileHelper');
    let PlaceType = require('./PlaceType');
    let Client = require('./Client');

    let count = await PlaceType.count({_id: newDoc.types});
    let clientExists = await Client.count({_id: newDoc.boss});
    if ((count === 0 && this.types.length !== 0) || (count !== this.types.length)) {
        throw new Error('Not found related model PlaceType!');
    }
    if (!clientExists && newDoc.boss) {
        throw new Error('Not found related model Client!');
    }
    if (newDoc.images) {
        for (let oldImage of this.images) {
            if (newDoc.images.indexOf(oldImage) === -1) {
                fileHelper.deleteFiles(oldImage)
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

        await HashTag.update(
            {places: this._id},
            {$pull: {places: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Client.update(
            {favoritePlaces: this._id},
            {$pull: {favoritePlaces: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        if (this.images.length > 0) {
            fileHelper.deleteFiles(this.images)
        }
        return next();
    } catch (e) {
        return next(e);
    }
});