let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    images: {
        type: [{
            type: String
        }]
    },
}, {
    timestamps: true,
    discriminatorKey: 'kind'
});
module.exports = mongoose.model('Promo', PromoSchema);

PromoSchema.methods.supersave = async function () {
    let Department = require('./Department');
    let Place = require('./Place');

    let author = await Department.findById(this.author);
    let place = await Place.findById(this.place);

    if (!author && this.author) {
        throw new Error('Not found related model Department!');
    }
    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    }

    return await this.save();
};

PromoSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let fileHelper = require(global.paths.HELPERS + '/fileHelper');

    if (newDoc.author || newDoc.place) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.images) {
        for (let oldImage of this.images) {
            if (newDoc.images.indexOf(oldImage) === -1) {
                fileHelper.deleteFiles(oldImage)
            }
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};
PromoSchema.pre('remove', async function (next) {
    let fileHelper = require(global.paths.HELPERS + '/fileHelper');
    try {
        if (this.images.length > 0) {
            fileHelper.deleteFiles(this.images)
        }
        return next();
    } catch (e) {
        return next(e);
    }
});
