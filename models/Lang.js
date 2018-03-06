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
module.exports = mongoose.model('Lang', LangSchema);

let Multilang = require('./Multilang');
LangSchema.pre('remove', async function (next) {
    try {
        let multilangs = await Multilang.find({lang: this._id});
        multilangs.forEach(async function (multilang) {
            multilang.lang = null;
            return await multilang.save();
        });
        return next();
    } catch (e) {
        return next(e);
    }
});