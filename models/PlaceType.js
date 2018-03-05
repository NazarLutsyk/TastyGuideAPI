let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
    multilang : [{
        type : Schema.Types.ObjectId,
        ref: 'PlaceTypeMultilang'
    }],
},{
    timestamps : true,
});
module.exports = mongoose.model('PlaceType',PlaceTypeSchema);

let Place = require('./Place');
let Multilang = require('./Multilang');
PlaceTypeSchema.pre('remove',async function (next) {
    await Place.update(
        {types: this._id},
        {$pull: {types: this._id}},
        {multi: true});
    let multilangs = await Multilang.find({lang : this._id});
    multilangs.forEach(function (multilang){
        multilang.remove();
    });
    next();
});