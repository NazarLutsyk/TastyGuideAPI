let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value : Number,
    comment : String,
    client : {
        type : Schema.Types.ObjectId,
        ref : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
},{
    timestamps : true,
});
module.exports = mongoose.model('Rating',RatingSchema);

let Place = require('./Place');
let Client = require('./Client');
RatingSchema.pre('remove',async function (next) {
    await Client.update(
        {ratings: this._id},
        {$pull: {ratings: this._id}},
        {multi: true});
    await Place.update(
        {ratings: this._id},
        {$pull: {ratings: this._id}},
        {multi: true});
    next();
});