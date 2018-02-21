let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PromoSchema = new Schema({
    multilang : {
        type : Schema.Types.ObjectId,
        rel: 'Multilang'
    },
    author : {
        type : Schema.Types.ObjectId,
        rel : 'Department'
    },
},{
    timestamps : true,
    discriminatorKey : 'kind'
});

module.exports = mongoose.model('Promo',PromoSchema);