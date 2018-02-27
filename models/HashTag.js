let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HashTagSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    places: [{
        type: Schema.Types.ObjectId,
        ref: 'Place'
    }],
}, {
    timestamps: true,
});
module.exports = mongoose.model('HashTag', HashTagSchema);

let Place = require('./Place');
HashTagSchema.pre('remove', async function (next) {
    await Place.update(
        {hashTags: this._id},
        {$pull: {hashTags: this._id}},
        {multi: true});
    next();
});
HashTagSchema.pre('save', async function (next) {
    if (this.places) {
        let places = await Place.find({_id: this.places});
        if (places) {
            places.forEach(function (place) {
                place.hashTags.push(this);
                place.save();
            });
            next();
        }
        let msg = 'Not found model:';
        if (!places) {
            msg += 'Place ';
        }
        next(new Error(msg));
    } else {
        next();
    }
});
