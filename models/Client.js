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
    applications : [{
        type : Schema.Types.ObjectId,
        rel : 'Application'
    }],
    ratings : [{
        type : Schema.Types.ObjectId,
        rel : 'Rating'
    }],
    complaints : [{
        type : Schema.Types.ObjectId,
        rel : 'Complaint'
    }],
    departments : [{
        type : Schema.Types.ObjectId,
        rel : 'Department'
    }],
    favoritePlaces : [{
        type : Schema.Types.ObjectId,
        rel : 'Place'
    }],
},{
    timestamps : true,
});

module.exports = mongoose.model('Client',ClientSchema);