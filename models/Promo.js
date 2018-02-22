let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    multilang : [{
        type : Schema.Types.ObjectId,
        ref: 'Multilang'
    }],
    author : {
        type : Schema.Types.ObjectId,
        ref : 'Department'
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
},{
    timestamps : true,
    discriminatorKey : 'kind'
});
module.exports = mongoose.model('Promo',PromoSchema);

let Place = require('./Place');
let Multilang = require('./Multilang');
let Department = require('./Department');
PromoSchema.pre('remove',async function (next) {
    await Place.update(
        {promos: this._id},
        {$pull: {promos: this._id}},
        {multi: true});
    await Department.update(
        {promos: this._id},
        {$pull: {promos: this._id}},
        {multi: true});
    this.multilang.forEach(async function (multId) {
        let mult = await Multilang.findById(multId);
        mult.remove();
    });
    next();
});