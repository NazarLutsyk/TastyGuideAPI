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
            {multi: true, runValidators: true,context:'query'});
        await Department.update(
            {promos: this._id},
            {$pull: {promos: this._id}},
            {multi: true, runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});

PromoSchema.pre('save', async function (next) {
    try {
        let client = await Department.findById(this.client);
        let place = await Place.findById(this.place);
        this.client = client ? client._id : null;
        this.place = place ? place._id : null;
        if (client && client.promos.indexOf(this._id) == -1) {
            await Department.findByIdAndUpdate(client._id,{$push : {promos : this}},{runValidators: true,context:'query'});
        }
        if (place && place.promos.indexOf(this._id) == -1) {
            await Place.findByIdAndUpdate(place._id,{$push : {promos : this._id}},{runValidators: true,context:'query'});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});

