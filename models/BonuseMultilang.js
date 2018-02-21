let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

module.exports = Multilang.discriminator('BonuseMultilang', new Schema({
    header : String,
    description : String,
    conditions : String,
    bonuse : {
        type : Schema.Types.ObjectId,
        ref : 'Bonuse'
    },
}, {
    discriminatorKey: 'kind'
}));