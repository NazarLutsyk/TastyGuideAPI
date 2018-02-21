let Place = require('../models/Place');
let Client = require('../models/Client');

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DrinkApplicationSchema = new Schema({
    friends : String,
    goal : String,
    budged : Number,
    date : Date,
    organizer : {
        type : Schema.Types.ObjectId,
        ref : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
    currency : {
        type : Schema.Types.ObjectId,
        ref : 'Currency'
    },
},{
    timestamps : true,
});

DrinkApplicationSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true})
            .exec();
        await Place.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true})
            .exec();
        next();
    } catch (e) {
        next(e);
    }
});

module.exports = mongoose.model('DrinkApplication',DrinkApplicationSchema);