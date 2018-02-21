let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

module.exports = Multilang.discriminator('PlaceTypeMultilang', new Schema({
    name : String,
    placeType : {
        type : Schema.Types.ObjectId,
        rel: 'PlaceType'
    },
}, {
    discriminatorKey: 'kind'
}));