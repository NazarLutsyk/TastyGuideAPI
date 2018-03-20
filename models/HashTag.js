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
    }

    return await this.save();
};

HashTagSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');

    let count = await Place.count({_id: newDoc.places});
    if ((count === 0 && this.places.length !== 0) || (count !== this.places.length)) {
        throw new Error('Not found related model Place!');
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('HashTag', HashTagSchema);