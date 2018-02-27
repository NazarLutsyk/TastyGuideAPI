let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

module.exports = Promo.discriminator('Bonuse', new Schema({
    startDate: {
        type: Date,
        required: true,
        validate : {
            validator : function (){
                return this.startDate < this.endDate;
            },
            message : 'Start date must be smaller than end date!'
        }
    },
    endDate: {
        type: Date,
        required: true,
    },
}, {
    discriminatorKey: 'kind'
}));