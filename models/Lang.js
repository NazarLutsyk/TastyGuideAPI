let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LangSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

LangSchema.methods.supersave = async function () {
    log('save Lang');
    return await this.save();
};

LangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');

    objectHelper.load(this, newDoc);
    log('update Lang');
    return await this.save();
};

module.exports = mongoose.model('Lang', LangSchema);

let Multilang = require('./Multilang');
LangSchema.pre('remove', async function (next) {
    try {
        await Multilang.update({lang: this._id}, {lang: null}, {multi: true, runValidators: true, context: "query"});
        log('remove Lang');
        return next();
    } catch (e) {
        return next(e);
    }
});