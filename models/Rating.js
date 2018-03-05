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
RatingSchema.pre('save', async function (next) {
    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);
    if (client && place) {
        client.ratings.push(this);
        place.ratings.push(this);
        await client.save();
        await place.save();
    }
    next();
    // let msg = 'Not found model:';
    // if (!client){
    //     msg += 'Client ';
    // }
    // if (!place){
    //     msg += 'Place';
    // }
    // next(new Error(msg));
});