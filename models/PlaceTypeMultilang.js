let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let PlaceTypeMultilangSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    placeType : {
        type : Schema.Types.ObjectId,
        ref: 'PlaceType',
        required:true
    },
}, {
    discriminatorKey: 'kind'
});
PlaceTypeMultilangSchema.statics.superfind = async function (params) {
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
                    if (fetchModelName.toLowerCase() === "placetype") {
                        fetchModel[fetchModelName].query._id = mainModel.placeType.toString();
                        mainModelToResponse.placeType = (await universalFind(require("./PlaceType"), fetchModel[fetchModelName]))[0];
                    }
                    if (fetchModelName.toLowerCase() === "lang") {
                        fetchModel[fetchModelName].query._id = mainModel.lang.toString();
                        mainModelToResponse.lang = (await universalFind(require("./Lang"), fetchModel[fetchModelName]))[0];
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
PlaceTypeMultilangSchema.methods.supersave = async function () {
    let PlaceType = require('./PlaceType');
    let Lang = require('./Lang');

    let placeType = await PlaceType.findById(this.placeType);
    let lang = await Lang.findById(this.lang);

    if (!placeType && this.placeType) {
        throw new Error('Not found related model PlaceType!');
    }
    if (!lang && this.lang)  {
        throw new Error('Not found related model Lang!');
    }
    log("save Multilang");
    return await this.save();
};
PlaceTypeMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.placeType) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.hasOwnProperty('lang')) {
        let lang = await Lang.count({_id: newDoc.lang});
        if (!lang)
            throw new Error('Not found related model Lang!');
    }
    objectHelper.load(this, newDoc);
    log("update Multilang");
    return await this.save();
};

module.exports = Multilang.discriminator('PlaceTypeMultilang', PlaceTypeMultilangSchema);