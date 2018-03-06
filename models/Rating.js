let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RatingSchema = new Schema({
    value: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: function () {
                return this.value >= 0 && this.value <= 5;
            },
            message: 'Reviews[min = 0,max = 5]'
        }
    },
    comment: String,
    price: {
        type: Number
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        // required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        // required: true
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
            {multi: true});
        await Place.update(
            {ratings: this._id},
            {$pull: {ratings: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
RatingSchema.pre('save', async function (next) {
    try {
        let client = await Client.findById(this.client);
        let place = await Place.findById(this.place);
        this.client = client ? client._id : '';
        this.place = place ? place._id : '';
        if (client && client.ratings.indexOf(this._id) == -1) {
            return await Client.findByIdAndUpdate(client._id,{$push : {ratings : this}});
        }
        if (place && place.ratings.indexOf(this._id) == -1) {
            return await Place.findByIdAndUpdate(place._id,{$push : {ratings : this}});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});