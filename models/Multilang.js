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
    discriminatorKey : 'kind',
    toJSON: {virtuals:true, getters: true},
    toObject: {virtuals:true, getters: true},
});

module.exports = mongoose.model('Multilang',MultilangSchema);

MultilangSchema.pre("remove", async function (next) {
    log('remove Multilang');
    return next();
});