let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceTypeMultilang'
    }],
}, {
    timestamps: true,
});
module.exports = mongoose.model('PlaceType', PlaceTypeSchema);

let Place = require('./Place');
let PlaceTypeMultilang = require('./PlaceTypeMultilang');
PlaceTypeSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {types: this._id},
            {$pull: {types: this._id}},
            {multi: true,runValidators: true,context:'query'});
        let multilangs = await PlaceTypeMultilang.find({placeType: this});
        multilangs.forEach(async function (multilang) {
            return await multilang.remove();
        });
        return next();
    } catch (e) {
        return next(e);
    }
});
PlaceTypeSchema.pre('save', async function (next) {
    let self = this;
    try {
        let multilangs = await PlaceTypeMultilang.find({_id: this.multilang});
        this.multilang = [];
        if (multilangs) {
            multilangs.forEach(function (multilang) {
                self.multilang.push(multilang._id);
            });
            multilangs.forEach(async function (multilang) {
                if (multilang.placeType) {
                    return self.multilang.splice(self.multilang.indexOf(multilang._id), 1);
                } else {
                    return await PlaceTypeMultilang.findByIdAndUpdate(multilang._id,{placeType : self},{runValidators: true,context:'query'});
                }
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});