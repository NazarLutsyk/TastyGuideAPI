let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

module.exports = Promo.discriminator('Bonus', new Schema({
    startDate : Date,
    endDate : Date,
    conditions : String
}, {
    discriminatorKey: 'kind'
}));