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
        rel: 'PlaceType'
    }],
    promos : [{
        type: Schema.Types.ObjectId,
        rel: 'Promo'
    }],
    complaints : [{
        type: Schema.Types.ObjectId,
        rel: 'Complaint'
    }],
    drinkApplications : [{
        type: Schema.Types.ObjectId,
        rel: 'DrinkApplication'
    }],
    ratings : [{
        type: Schema.Types.ObjectId,
        rel: 'Rating'
    }],
    departments : [{
        type: Schema.Types.ObjectId,
        rel: 'Department'
    }],
    multilang : {
        type : Schema.Types.ObjectId,
        rel: 'Multilang'
    },
    days : [{
        type : Schema.Types.ObjectId,
        rel : 'Day'
    }],
    hashTags : [{
        type : Schema.Types.ObjectId,
        rel : 'HashTag'
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Place', PlaceSchema);