let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TopPlaceSchema = new Schema({
    startDate : {
        type: Date,
        required : true,
        validate : {
            validator : function (){
                return this.startDate < this.endDate;
            },
            message : 'Start date must be smaller than end date!'
        }
    },
    endDate : {
        type: Date,
        required : true
    },
    price : {
        type: Number,
        required : true
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place',
    },
},{
    timestamps : true,
});
module.exports = mongoose.model('TopPlace',TopPlaceSchema);
