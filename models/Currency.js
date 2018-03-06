let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CurrencySchema = new Schema({
    value: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Currency', CurrencySchema);

let DrinkApplication = require('./DrinkApplication');
CurrencySchema.pre('remove',async function (next) {
    try {
        await DrinkApplication.update(
            {currency: this._id},
            {currency: null},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
