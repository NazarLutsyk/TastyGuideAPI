let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceSchema = new Schema({
    ratingScore: Number,
    phone: String,
    location: {
        ltg: Number,
        lng: Number
    },
    image: String,
    averagePrice: String,
    reviews: Number,
    types: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceType'
    }],
    promos : [{
        type: Schema.Types.ObjectId,
        ref: 'Promo'
    }],
    complaints : [{
        type: Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    drinkApplications : [{
        type: Schema.Types.ObjectId,
        ref: 'DrinkApplication'
    }],
    ratings : [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    departments : [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }],
    multilang : [{
        type : Schema.Types.ObjectId,
        ref: 'Multilang'
    }],
    days : [{
        type : Schema.Types.ObjectId,
        ref : 'Day'
    }],
    hashTags : [{
        type : Schema.Types.ObjectId,
        ref : 'HashTag'
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Place', PlaceSchema);