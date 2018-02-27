let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DaySchema = new Schema({
    date : {
        type : Date,
        required : true
    },
    startTime : {
        type : Date,
        required : true,
        validate : {
            validator : function (){
                return this.startTime < this.endTime;
            },
            message : 'Start date must be smaller than end date!'
        }
    },
    endTime : {
        type : Date,
        required : true
    },
    holiday : {
        type : Boolean,
        default : false
    },
    place : {
        type : Schema.Types.ObjectId,
        ref : 'Place',
        required : true
    }
},{
    timestamps : true,
});
module.exports = mongoose.model('Day',DaySchema);

let Place = require('./Place');
DaySchema.pre('remove',async function (next) {
    await Place.update(
        {days: this._id},
        {$pull: {days: this._id}},
        {multi: true});
    next();
});
DaySchema.pre('save', async function (next) {
    let place = await Place.findById(this.place);
    if (place) {
        place.days.push(this);
        place.save();
        next();
    }
    let msg = 'Not found model:';
    if (!place){
        msg += 'Place';
    }
    next(new Error(msg));
});