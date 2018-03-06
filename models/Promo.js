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
let Department = require('./Department');
PromoSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {promos: this._id},
            {$pull: {promos: this._id}},
            {multi: true});
        await Department.update(
            {promos: this._id},
            {$pull: {promos: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});

PromoSchema.pre('save', async function (next) {
    try {
        let client = await Department.findById(this.client);
        let place = await Place.findById(this.place);
        this.client = client ? client._id : '';
        this.place = place ? place._id : '';
        if (client && client.promos.indexOf(this._id) == -1) {
            return await Department.findByIdAndUpdate(client._id,{$push : {promos : this}});
        }
        if (place && place.promos.indexOf(this._id) == -1) {
            return await Place.findByIdAndUpdate(place._id,{$push : {promos : this._id}});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});

