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
    try {
        await Place.update(
            {hashTags: this._id},
            {$pull: {hashTags: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
HashTagSchema.pre('save', async function (next) {
    let self = this;
    try {
        let places = await Place.find({_id: this.places});
        this.places = [];
        if (places) {
            places.forEach(function (place) {
                self.places.push(place._id);
            });
            places.forEach(async function (place) {
                if (place.hashTags.indexOf(self._id) == -1) {
                    return await Place.findByIdAndUpdate(place._id, {$push: {hashTags : self}});
                }else {
                    return;
                }
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});
