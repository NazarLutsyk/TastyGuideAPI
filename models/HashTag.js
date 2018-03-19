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

HashTagSchema.methods.supersave = async function () {
    let Place = require('./Place');

    let count = await Place.count({_id: this.places});

    if ((count === 0 && this.places.length !== 0) || (count !== this.places.length)) {
        throw new Error('Not found related model Place!');
    } else if (count === this.places.length) {
        await Place.update({_id: this.places}, {$addToSet: {hashTags: this}}, {multi: true,runValidators:true});
    }
    return await this.save();
};

HashTagSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');
    if (newDoc.hasOwnProperty('places')) {
        let count = await Place.count({_id: newDoc.places});
        if (count == newDoc.places.length) {
            let toAdd = [];
            let toRemove = [];
            for (let place of newDoc.places) {
                if (this.places.indexOf(place.toString()) === -1)
                    toAdd.push(place);
            }
            for (let place of this.places) {
                if (newDoc.places.indexOf(place.toString()) === -1)
                    toRemove.push(place);
            }
            if (toRemove)
                await Place.update({_id: {$in: toRemove}}, {$pull: {hashTags: this._id}}, {multi: true,runValidators: true, context: 'query'});
            if (toAdd)
                await Place.update({_id: {$in: toAdd}}, {$addToSet: {hashTags: this._id}}, {multi: true,runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

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