let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MultilangSchema = new Schema({
    lang : {
        type : Schema.Types.ObjectId,
        rel : 'Lang'
    },
},{
    timestamps : true,
    discriminatorKey : 'kind'
});

module.exports = mongoose.model('Multilang',MultilangSchema);