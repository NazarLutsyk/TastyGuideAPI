let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HashTagSchema = new Schema({
    value : String,
    places : [{
        type : Schema.Types.ObjectId,
        rel: 'Place'
    }],
},{
    timestamps : true,
});

module.exports = mongoose.model('HashTag',HashTagSchema);