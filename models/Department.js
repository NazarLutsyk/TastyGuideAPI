let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
    roles : [String],
    client : {
        type : Schema.Types.ObjectId,
        ref : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place'
    },
    promos : [{
        type : Schema.Types.ObjectId,
        ref : 'Promo'
    }]
},{
    timestamps : true,
});

module.exports = mongoose.model('Department',DepartmentSchema);