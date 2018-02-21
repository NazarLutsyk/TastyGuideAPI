let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlaceTypeSchema = new Schema({
    multilang : [{
        type : Schema.Types.ObjectId,
        ref: 'Multilang'
    }],
},{
    timestamps : true,
});

module.exports = mongoose.model('PlaceType',PlaceTypeSchema);