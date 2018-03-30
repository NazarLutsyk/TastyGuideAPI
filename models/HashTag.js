let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HashTagSchema = new Schema({
    value: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

HashTagSchema.methods.supersave = async function () {
    log('save HashTag');
    return await this.save();
};

HashTagSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');

    objectHelper.load(this, newDoc);
    log('update HashTag');
    return await this.save();
};

module.exports = mongoose.model('HashTag', HashTagSchema);

let Place = require('./Place');
HashTagSchema.pre('remove', async function (next) {
    try {
        await Place.update(
            {hashTags: this._id},
            {$pull:{hashTags:this._id}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        log('remove HashTag');
        return next();
    } catch (e) {
        return next(e);
    }
});
