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

let Place = require('./Place');
let Client = require('./Client');
let Promo = require('./Promo');
DepartmentSchema.pre('remove',async function (next) {
    await Client.update(
        {departments: this._id},
        {$pull: {departments: this._id}},
        {multi: true});
    await Place.update(
        {departments: this._id},
        {$pull: {departments: this._id}},
        {multi: true});
    let promos = await Promo.find({author : this._id});
    promos.forEach(function (promo){
        promo.remove();
    });
    next();
});