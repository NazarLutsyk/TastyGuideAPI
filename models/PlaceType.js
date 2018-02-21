let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
    multilang : {
        type : Schema.Types.ObjectId,
        rel: 'Multilang'
    },
},{
    timestamps : true,
});

module.exports = mongoose.model('PlaceType',PlaceTypeSchema);