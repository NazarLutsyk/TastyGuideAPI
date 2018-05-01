let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let NewsSchema = new Schema({
}, {
    discriminatorKey: 'kind'
});
NewsSchema.statics.superfind = async function (params) {
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
                    if (fetchModelName.toLowerCase() === "newsmultilang") {
                        fetchModel[fetchModelName].query.promo = mainModel._id.toString();
                        mainModelToResponse.multilang = await universalFind(require("./NewsMultilang"), fetchModel[fetchModelName]);
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
module.exports = Promo.discriminator('News', NewsSchema);

let Multilang = require('./NewsMultilang');
NewsSchema.pre('remove', async function (next) {
    console.log("remove news");
    try {
        let multilangs = await Multilang.find({promo: this._id});
        for (const multilang of multilangs) {
            await multilang.remove();
        }
        return next();
    } catch (e) {
        return next(e);
    }
});