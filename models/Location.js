let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LocationSchema = new Schema({
    ltg : {
        type : Number,
        required : true
    },
    lng : {
        type : Number,
        required : true
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place',
        required : true
    }
},{
    timestamps : true,
});
module.exports = mongoose.model('Location',LocationSchema);

let Place = require('./Place');
LocationSchema.pre('remove',async function (next) {
    await Place.update(
        {locations: this._id},
        {$pull: {locations: this._id}},
        {multi: true});
    next();
});
LocationSchema.pre('save', async function (next) {
    let place = await Place.findById(this.place);
    if (place) {
        place.location.push(this);
        place.save();
        next();
    }
    let msg = 'Not found model:';
    if (!place){
        msg += 'Place';
    }
    next(new Error(msg));
});