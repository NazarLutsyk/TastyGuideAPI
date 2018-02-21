let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ClientSchema = new Schema({
    name : String,
    surname : String,
    login : String,
    password : String,
    city : String,
    phone : String,
    email : String,
    roles : [String],
    drinkApplications : [{
        type : Schema.Types.ObjectId,
        ref : 'DrinkApplication'
    }],
    ratings : [{
        type : Schema.Types.ObjectId,
        ref : 'Rating'
    }],
    complaints : [{
        type : Schema.Types.ObjectId,
        ref : 'Complaint'
    }],
    departments : [{
        type : Schema.Types.ObjectId,
        ref : 'Department'
    }],
    favoritePlaces : [{
        type : Schema.Types.ObjectId,
        ref : 'Place'
    }],
},{
    timestamps : true,
});

module.exports = mongoose.model('Client',ClientSchema);