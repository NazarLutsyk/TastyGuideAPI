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
        await Multilang.update({lang: this._id},{lang:null},{multi:true,runValidators:true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});