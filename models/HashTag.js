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

HashTagSchema.statics.superfind = async function (params) {
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
                    if (fetchModelName.toLowerCase() === "place") {
                        fetchModel[fetchModelName].query.hashTags = mainModel._id.toString();
                        mainModelToResponse.places = await universalFind(require("./Place"), fetchModel[fetchModelName]);
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
