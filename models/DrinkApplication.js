let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DrinkApplicationSchema = new Schema({
    friends : String,
    goal : String,
    budged : Number,
    date : Date,
    organizer : {
        type : Schema.Types.ObjectId,
        rel : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        rel : 'Place'
    },
    currency : {
        type : Schema.Types.ObjectId,
        rel : 'Currency'
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('DrinkApplication',DrinkApplicationSchema);