let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
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
    let Place = require('./Place');
    let Client = require('./Client');

    let place = await Place.findById(this.place);
    let department = await Client.findById(this.author);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    }
    if (!department && this.author) {
        throw new Error('Not found related model Client!');
    }
    log('save Promo');
    return await this.save();
};

PromoSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let fileHelper = require('../helpers/fileHelper');
    let path = require('path');


    if (newDoc.author || newDoc.place) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.images) {
        for (let i = 0; i < this.images.length; i++) {
            let oldImage = this.images[i];
            if (newDoc.images.indexOf(oldImage) === -1) {
                let toDelete = path.join(__dirname,"../public","upload","promo", oldImage);
                fileHelper.deleteFiles(toDelete);
            }
        }
    }
    objectHelper.load(this, newDoc);
    log('update Promo');
    return await this.save();
};
PromoSchema.pre('remove', async function (next) {
    let fileHelper = require('../helpers/fileHelper');
    let path = require('path');
    try {
        if (this.images.length > 0) {
            for (let i = 0; i < this.images.length; i++) {
                let image = this.images[i];
                let toDelete = path.join(__dirname,"../public","upload","place", image);
                fileHelper.deleteFiles(toDelete);
            }
        }
        log('remove Promo');
        return next();
    } catch (e) {
        return next(e);
    }
});
