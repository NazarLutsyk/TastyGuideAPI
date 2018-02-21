let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

module.exports = Multilang.discriminator('NewsMultilang', new Schema({
    header : String,
    description : String,
    news : {
        type : Schema.Types.ObjectId,
        ref : 'News'
    },
}, {
    discriminatorKey: 'kind'
}));