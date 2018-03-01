let mongoose = require('mongoose');
let path = require('path');

let Schema = mongoose.Schema;

let PlaceSchema = new Schema({
    ratingScore: Number,//todo get set
    phone: {
        type: String,
        required: true,
        match: /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    locations: [{
        type: Schema.Types.ObjectId,
        ref: 'Location',
    }],
    avatar: {
        type: String,
        default: 'default.jpg'
    },
    images: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Image'
        }],
        validate: {
            validator: function () {
                return this.images.length <= 4;
            },
            message: '{PATH} exceeds the limit of 4'
        }
    },
    averagePrice: {
        type: Number,
        default: 0,
        validate: {
            validator: function () {
                return this.averagePrice >= 0;
            },
            message: 'Min avaragePrive eq 0'
        }
    },
    reviews: {
        type: Number,
        default: 0,
        validate: {
            validator: function () {
                return this.reviews >= 0;
            },
            message: 'Min reviews eq 0'
        }
    },
    allowed: {
        type: Boolean,
        default: false,
    },
    boss: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    types: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceType'
    }],
    promos: [{
        type: Schema.Types.ObjectId,
        ref: 'Promo'
    }],
    complaints: [{
        type: Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    drinkApplications: [{
        type: Schema.Types.ObjectId,
        ref: 'DrinkApplication'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    departments: [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }],
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'Multilang',
    }],
    days: [{
        type: Schema.Types.ObjectId,
        ref: 'Day'
    }],
    hashTags: [{
        type: Schema.Types.ObjectId,
        ref: 'HashTag'
    }],
    tops: [{
        type: Schema.Types.ObjectId,
        ref: 'TopPlace'
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Place', PlaceSchema);

let Complaint = require('./Complaint');
let DrinkApplication = require('./DrinkApplication');
let Rating = require('./Rating');
let Department = require('./Department');
let TopPlace = require('./TopPlace');
let Day = require('./Day');
let Promo = require('./Promo');
let HashTag = require('./HashTag');
let Multilang = require('./Multilang');
let Location = require('./Location');
let Client = require('./Client');
let Config = require('../config/config');

PlaceSchema.pre('remove', async function (next) {
    let complaints = await Complaint.find({place: this._id});
    let drinkApplications = await DrinkApplication.find({place: this._id});
    let ratings = await Rating.find({place: this._id});
    let departments = await Department.find({place: this._id});
    let topPlaces = await TopPlace.find({place: this._id});
    let days = await Day.find({place: this._id});
    let promos = await Promo.find({place: this._id});
    let locations = await Location.find({location: this._id});

    complaints.forEach(function (complaint) {
        complaint.remove();
    });
    drinkApplications.forEach(function (drinkApplication) {
        drinkApplication.remove();
    });
    ratings.forEach(function (rating) {
        rating.remove();
    });
    departments.forEach(function (department) {
        department.remove();
    });
    topPlaces.forEach(function (topPlace) {
        topPlace.remove();
    });
    days.forEach(function (day) {
        day.remove();
    });
    promos.forEach(function (promo) {
        promo.remove();
    });
    locations.forEach(function (location) {
        location.remove();
    });
    this.multilang.forEach(async function (multId) {
        let mult = await Multilang.findById(multId);
        mult.remove();
    });
    await HashTag.update(
        {places: this._id},
        {$pull: {places: this._id}},
        {multi: true});
    await Client.update(
        {ownPlaces: this._id},
        {$pull: {ownPlaces: this._id}},
        {multi: true});
    next();
});

PlaceSchema.pre('save', async function (next) {
    if (this.boss) {
        let boss = await Client.findById(this.boss);
        if (boss) {
            boss.ownPlaces.push(this);
            boss.save();
        } else {
            return next(new Error('Model not found: Client'));
        }
    }
    if (this.hashTags) {
        let hashTags = await HashTag.find({_id: this.hashTags});
        if (hashTags) {
            let self = this;
            hashTags.forEach(function (hashTag) {
                hashTag.places.push(self);
                hashTag.save();
            });
        } else {
            return next(new Error('Model not found: HashTag'));
        }
    }
    return next();
});

