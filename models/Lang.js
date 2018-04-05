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
LangSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    let {target, fetch} = params;
    let res = [];
    let listOfMainModels = await universalFind(this, target);
    if (fetch && listOfMainModels && !target.aggregate) {
        for (let mainModel of listOfMainModels) {
            let mainModelToResponse = mainModel.toObject();
            if (mainModel._id) {
                for (let fetchModel of fetch) {
                    let fetchModelName = Object.keys(fetchModel)[0];
                    if (fetchModelName.toLowerCase() === "multilang") {
                        fetchModel[fetchModelName].query.lang = mainModel._id.toString();
                        mainModelToResponse.multilang = await universalFind(require("./Multilang"), fetchModel[fetchModelName]);
                    }
                }
            }
            res.push(mainModelToResponse);
        }
    }else if(target.aggregate){
        res.push(...listOfMainModels);
    }
    return res;
};
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