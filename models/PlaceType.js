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

PlaceTypeSchema.methods.supersave = async function () {
    let PlaceTypeMultilang = require('./PlaceTypeMultilang');

    let count = await PlaceTypeMultilang.count({_id: this.multilang});

    if ((count === 0 && this.multilang.length !== 0) || (count !== this.multilang.length)) {
        throw new Error('Not found related model PlaceTypeMultilang!');
    } else if (count === this.multilang.length) {
        await PlaceTypeMultilang.update({_id: this.multilang}, {placeType: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }
    return await this.save();
};
PlaceTypeSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let PlaceTypeMultilang = require('./PlaceTypeMultilang');

    if (newDoc.hasOwnProperty('multilang')) {
        let count = await PlaceTypeMultilang.count({_id: newDoc.multilang});
        if (count == newDoc.multilang.length) {
            let toAdd = [];
            let toRemove = [];
            for (let multilang of newDoc.multilang) {
                if (this.multilang.indexOf(multilang.toString()) === -1)
                    toAdd.push(multilang);
            }
            for (let multilang of this.multilang) {
                if (newDoc.multilang.indexOf(multilang.toString()) === -1)
                    toRemove.push(multilang);
            }
            if (toRemove)
                await PlaceTypeMultilang.update({_id: {$in: toRemove}}, {placeType: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await PlaceTypeMultilang.update({_id: {$in: toAdd}}, {placeType: this._id}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('PlaceType', PlaceTypeSchema);

let Place = require('./Place');
let PlaceTypeMultilang = require('./PlaceTypeMultilang');
PlaceTypeSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {types: this._id},
            {$pull: {types: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await PlaceTypeMultilang.remove({placeType: this._id});
        return next();
    } catch (e) {
        return next(e);
    }
});