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

MultilangSchema.pre('find',function () {
    console.log(arguments);
});

module.exports = mongoose.model('Multilang',MultilangSchema);