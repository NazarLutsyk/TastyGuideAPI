let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
    roles : [String],
    client : {
        type : Schema.Types.ObjectId,
        rel : 'Client'
    },
    place : {
        type : Schema.Types.ObjectId,
        rel : 'Place'
    },
    promos : [{
        type : Schema.Types.ObjectId,
        rel : 'Promo'
    }]
},{
    timestamps : true,
});

module.exports = mongoose.model('Department',DepartmentSchema);