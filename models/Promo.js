let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        // required : true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }
}, {
    timestamps: true,
    discriminatorKey: 'kind'
});
module.exports = mongoose.model('Promo', PromoSchema);

let Place = require('./Place');
let Multilang = require('./Multilang');
let Department = require('./Department');
let path = require('path');
PromoSchema.pre('remove', async function (next) {
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

PromoSchema.pre('save', async function (next) {
    let client = await Department.findById(this.client);
    let place = await Place.findById(this.place);
    if (client && place) {
        client.promos.push(this);
        place.promos.push(this);
        await client.save();
        await place.save();
    }
    next();
    // let msg = 'Not found model:';
    // if (!client){
    //     msg += 'Department ';
    // }
    // if (!place){
    //     msg += 'Place';
    // }
    // next(new Error(msg));
});

