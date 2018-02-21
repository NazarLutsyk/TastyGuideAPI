let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Multilang = require('./Multilang');

module.exports = Multilang.discriminator('EventMultilang', new Schema({
    header : String,
    description : String,
    event : {
        type : Schema.Types.ObjectId,
        ref : 'Event'
    },
}, {
    discriminatorKey: 'kind'
}));
