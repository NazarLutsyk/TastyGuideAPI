let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

module.exports = Promo.discriminator('Event', new Schema({
}, {
    discriminatorKey: 'kind'
}));