let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceSchema = new Schema({
    posRating: Number,
    negRating: Number,
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
    applications : [{
        type: Schema.Types.ObjectId,
        rel: 'Application'
    }],
    ratings : [{
        type: Schema.Types.ObjectId,
        rel: 'Rating'
    }],
    departments : [{
        type: Schema.Types.ObjectId,
        rel: 'Department'
    }],
    placeMultilang : {
        type : Schema.Types.ObjectId,
        rel: 'PlaceMultilang'
    },
    days : [{
        type : Schema.Types.ObjectId,
        rel : 'Day'
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Place', PlaceSchema);