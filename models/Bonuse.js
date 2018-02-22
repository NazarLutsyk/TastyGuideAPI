let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

module.exports = Promo.discriminator('Bonuse', new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
}, {
    discriminatorKey: 'kind'
}));