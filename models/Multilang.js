let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MultilangSchema = new Schema({
    lang : {
        type : Schema.Types.ObjectId,
        ref : 'Lang'
    },
},{
    timestamps : true,
    discriminatorKey : 'kind'
});

module.exports = mongoose.model('Multilang',MultilangSchema);