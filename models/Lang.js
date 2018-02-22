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
    let multilangs = await Multilang.find({lang: this._id});
    multilangs.forEach(function (multilang) {
        multilang.remove();
    });
    next();
});