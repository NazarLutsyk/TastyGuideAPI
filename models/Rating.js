let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 5;
            },
            message: 'Value[min = 0,max = 5]'
        }
    },
    comment: String,
    price: {
        type: Number
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('Rating', RatingSchema);

let Place = require('./Place');
let Client = require('./Client');
RatingSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {ratings: this._id},
            {$pull: {ratings: this._id}},
            {multi: true,runValidators: true,context:'query'});
        await Place.update(
            {ratings: this._id},
            {$pull: {ratings: this._id}},
            {multi: true, runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
RatingSchema.pre('save', async function (next) {
    try {
        let client = await Client.findById(this.client);
        let place = await Place.findById(this.place);
        this.client = client ? client._id : null;
        this.place = place ? place._id : null;
        if (client && client.ratings.indexOf(this._id) == -1) {
            return await Client.findByIdAndUpdate(client._id,{$push : {ratings : this}},{runValidators: true,context:'query'});
        }
        if (place && place.ratings.indexOf(this._id) == -1) {
            return await Place.findByIdAndUpdate(place._id,{$push : {ratings : this}},{runValidators: true,context:'query'});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});