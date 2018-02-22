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
module.exports = mongoose.model('DrinkApplication',DrinkApplicationSchema);

let Place = require('./Place');
let Client = require('./Client');
DrinkApplicationSchema.pre('remove',async function (next) {
    await Client.update(
        {drinkApplications: this._id},
        {$pull: {drinkApplications: this._id}},
        {multi: true});
    await Place.update(
        {drinkApplications: this._id},
        {$pull: {drinkApplications: this._id}},
        {multi: true});
    next();
});

