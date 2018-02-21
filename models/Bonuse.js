let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

module.exports = Promo.discriminator('Bonuse', new Schema({
    startDate : Date,
    endDate : Date,
}, {
    discriminatorKey: 'kind'
}));