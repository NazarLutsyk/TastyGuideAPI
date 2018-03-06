let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceTypeMultilangSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    placeType : {
        type : Schema.Types.ObjectId,
        ref: 'PlaceType',
    },
}, {
    discriminatorKey: 'kind'
});
module.exports = Multilang.discriminator('PlaceTypeMultilang', PlaceTypeMultilangSchema);

let PlaceType = require('./PlaceType');
PlaceTypeMultilangSchema.pre('remove',async function (next) {
    try {
        await PlaceType.update(
            {multilang: this._id},
            {$pull: {multilang: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
PlaceTypeMultilangSchema.pre('save', async function (next) {
    try {
        let placeType = await PlaceType.findById(this.placeType);
        this.placeType = placeType ? placeType._id : '';
        if (placeType  && placeType .multilang.indexOf(this._id) == -1) {
            return await PlaceType.findByIdAndUpdate(placeType ._id,{$push : {multilang : this}});
        }
        next();
    } catch (e) {
        return next(e);
    }
});