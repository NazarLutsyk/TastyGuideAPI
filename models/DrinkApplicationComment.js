let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let DrinkApplicationComment = new Schema({
    value: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    drinkApplication: {
        type: Schema.Types.ObjectId,
        ref: "DrinkApplication",
        required: true
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},
});
DrinkApplicationComment.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};
DrinkApplicationComment.methods.supersave = async function () {
    let Client = require("./Client");
    let DrinkAplication = require("./DrinkApplication");

    let sender = await Client.findById(this.sender);
    let drinkApp = await DrinkAplication.findById(this.drinkApplication);

    if (!sender || !drinkApp) {
        throw new Error("Not found related model!");
    }
    log("save Comment");
    return await this.save();
};

module.exports = mongoose.model("DrinkApplicationComment", DrinkApplicationComment);


DrinkApplicationComment.pre("remove", async function (next) {
    log("remove Comment");
    return next();
});