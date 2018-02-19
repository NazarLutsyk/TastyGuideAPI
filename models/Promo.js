let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    header : String,
    description : String,
    author : {
        type : Schema.Types.ObjectId,
        rel : 'Department'
    },
},{
    timestamps : true,
    discriminatorKey : 'kind'
});

module.exports = mongoose.model('Promo',PromoSchema);