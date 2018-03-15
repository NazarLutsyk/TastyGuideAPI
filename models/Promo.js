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
