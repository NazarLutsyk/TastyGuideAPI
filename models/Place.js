let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceSchema = new Schema({
    ratingScore: Number,
    phone: {
        type: String,
        required: true
    },
    locations: [{
        type: Schema.Types.ObjectId,
        ref: 'Location',
    }],
    image: String,
    averagePrice: String,
    reviews: Number,
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

PlaceSchema.pre('remove', async function (next) {
    let complaints = await Complaint.find({place: this._id});
    let drinkApplications = await DrinkApplication.find({place: this._id});
    let ratings = await Rating.find({place: this._id});
    let departments = await Department.find({place: this._id});
    let topPlaces = await TopPlace.find({place: this._id});
    let days = await Day.find({place: this._id});
    let promos = await Promo.find({place: this._id});
    let locations = await Location.find({location : this._id});

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
    next();
});