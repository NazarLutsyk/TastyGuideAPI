let mongoose = require('mongoose');
let Schema = mongoose.Schema;

ImageSchema = new Schema({
    name: String,
    path: String,
    extension: String
});

module.exports = mongoose.model('Image', ImageSchema);

let fileHelper = require('../helpers/fileHelper');

ImageSchema.pre('remove', function (next) {
    fileHelper.deleteFiles(this.path);
    next();
});