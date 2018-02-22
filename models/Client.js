let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ClientSchema = new Schema({
    name : String,
    surname : String,
    login : String,
    password : String,
    city : String,
    phone : String,
    email : String,
    roles : [String],
    drinkApplications : [{
        type : Schema.Types.ObjectId,
        ref : 'DrinkApplication'
    }],
    ratings : [{
        type : Schema.Types.ObjectId,
        ref : 'Rating'
    }],
    complaints : [{
        type : Schema.Types.ObjectId,
        ref : 'Complaint'
    }],
    departments : [{
        type : Schema.Types.ObjectId,
        ref : 'Department'
    }],
    favoritePlaces : [{
        type : Schema.Types.ObjectId,
        ref : 'Place'
    }],
},{
    timestamps : true,
});
module.exports = mongoose.model('Client',ClientSchema);

let Complaint = require('./Complaint');
let DrinkApplication = require('./DrinkApplication');
let Rating = require('./Rating');
let Department = require('./Department');
ClientSchema.pre('remove', async function (next) {
    let complaints = await Complaint.find({client : this._id});
    let drinkApplications = await DrinkApplication.find({client : this._id});
    let ratings = await Rating.find({client : this._id});
    let departments = await Department.find({client : this._id});

    complaints.forEach(function (complaint){
        complaint.remove();
    });
    drinkApplications.forEach(function (drinkApplication){
        drinkApplication.remove();
    });
    ratings.forEach(function (rating){
        rating.remove();
    });
    departments.forEach(function (department){
        department.remove();
    });
    next();
});