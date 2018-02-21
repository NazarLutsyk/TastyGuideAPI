let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

module.exports = Multilang.discriminator('PlaceMultilang', new Schema({
    name : String,
    description : String,
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
}, {
    discriminatorKey: 'kind'
}));
