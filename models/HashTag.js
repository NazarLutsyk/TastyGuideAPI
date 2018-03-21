let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HashTagSchema = new Schema({
    value: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('HashTag', HashTagSchema);

let Place = require('./Place');
HashTagSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {hashTags: this._id},
            {$pull:{hashTags:this._id}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        return next();
    } catch (e) {
        return next(e);
    }
});
