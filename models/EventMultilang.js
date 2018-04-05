let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

let EventMultilangSchema = new Schema({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    promo: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
}, {
    discriminatorKey: 'kind'
});
EventMultilangSchema.statics.superfind = async function (params) {
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
                    if (fetchModelName.toLowerCase() === "event") {
                        fetchModel[fetchModelName].query._id = mainModel.promo.toString();
                        mainModelToResponse.promo = (await universalFind(require("./Event"), fetchModel[fetchModelName]))[0];
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
EventMultilangSchema.methods.supersave = async function () {
    let Event = require('./Event');
    let Lang = require('./Lang');

    let promo = await Event.findById(this.promo);
    let lang = await Lang.findById(this.lang);

    if (!promo) {
        throw new Error('Not found related model Event!');
    }
    if (!lang) {
        throw new Error("Not found related model Lang!");
    }
    log('save Multilang');
    return await this.save();
};
EventMultilangSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    let Lang = require('./Lang');

    if (newDoc.promo) {
        throw new Error('Can`t update relations!');
    }
    if (newDoc.hasOwnProperty('lang')) {
        let lang = await Lang.count({_id: newDoc.lang});
        if (!lang)
            throw new Error('Not found related model Lang!');
    }
    objectHelper.load(this, newDoc);
    log('update Multilang');
    return await this.save();
};

module.exports = Multilang.discriminator('EventMultilang', EventMultilangSchema);