let mongoose = require('mongoose');
let Schema = mongoose.Schema;

ImageSchema = new Schema({
    name: String,
    path: String,
    extension: String
});

module.exports = mongoose.model('Image', ImageSchema);

let fileHelper = require(global.paths.HELPERS + '/fileHelper');
let Promo = require('./Promo');
let Place = require('./Place');
ImageSchema.pre('remove', async function (next) {
    try {
        fileHelper.deleteFiles(this.path);
        await Promo.update(
            {image: this._id},
            {image: null},
            {multi: true, runValidators: true, context: 'query'});
        await Place.update(
            {images: this._id},
            {$pull: {images: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});