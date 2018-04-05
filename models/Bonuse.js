let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let BonuseSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
    },
}, {
    discriminatorKey: 'kind'
});
BonuseSchema.statics.superfind = async function (params) {
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
                    if (fetchModelName.toLowerCase() === "client") {
                        fetchModel[fetchModelName].query._id = mainModel.author.toString();
                        mainModelToResponse.author = (await universalFind(require("./Client"), fetchModel[fetchModelName]))[0];
                    }
                    if (fetchModelName.toLowerCase() === "place") {
                        fetchModel[fetchModelName].query._id = mainModel.place.toString();
                        mainModelToResponse.place = (await universalFind(require("./Place"), fetchModel[fetchModelName]))[0];
                    }
                    if (fetchModelName.toLowerCase() === "bonusemultilang") {
                        fetchModel[fetchModelName].query.promo = mainModel._id.toString();
                        mainModelToResponse.multilang = await universalFind(require("./BonuseMultilang"), fetchModel[fetchModelName]);
                    }
                }
            }
            res.push(mainModelToResponse);
        }
    } else if (target.aggregate) {
        res.push(...listOfMainModels);
    }
    return res;
};
module.exports = Promo.discriminator('Bonuse', BonuseSchema);

let Multilang = require('./BonuseMultilang');
BonuseSchema.pre('remove', async function (next) {
    try {
        await Multilang.remove({promo: this._id});
        return next();
    } catch (e) {
        return next(e);
    }
});