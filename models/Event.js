let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

module.exports = Promo.discriminator('Event', new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'EventMultilang'
    }],
}, {
    discriminatorKey: 'kind'
}));