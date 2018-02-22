let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HashTagSchema = new Schema({
    value : {
        type: String,
        required : true
    },
    places : [{
        type : Schema.Types.ObjectId,
        ref: 'Place'
    }],
},{
    timestamps : true,
});
module.exports = mongoose.model('HashTag',HashTagSchema);

let Place = require('./Place');
HashTagSchema.pre('remove',async function (next) {
    await Place.update(
        {hashTags: this._id},
        {$pull: {hashTags: this._id}},
        {multi: true});
    next();
});