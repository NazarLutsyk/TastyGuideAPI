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
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
HashTagSchema.pre('save', async function (next) {
    let self = this;
    try {
        let places = await Place.find({_id: this.places});
        if (!places && this.places != null) {
            return next(new Error('Not found related model!'));
        } else if (places.length !== this.places.length) {
            return next(new Error('Not found related model!'));
        } else {
            for (let place of places) {
                if (place.hashTags.indexOf(self._id) == -1) {
                    await Place.findByIdAndUpdate(place._id, {$push: {hashTags: self}}, {
                        runValidators: true,
                        context: 'query'
                    });
                }
            }
            return next();
        }
    } catch (e) {
        return next(e);
    }
});
