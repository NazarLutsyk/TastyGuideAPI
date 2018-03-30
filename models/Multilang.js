let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MultilangSchema = new Schema({
    lang : {
        type : Schema.Types.ObjectId,
        ref : 'Lang',
        required: true
    },
},{
    timestamps : true,
    discriminatorKey : 'kind'
});

module.exports = mongoose.model('Multilang',MultilangSchema);

MultilangSchema.pre("remove", async function (next) {
    log('remove Multilang');
    return next();
});