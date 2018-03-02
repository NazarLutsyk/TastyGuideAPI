let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
    roles: [{
        type: String,
        required : true//todo enum
    }],
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required : true
    },
    promos: [{
        type: Schema.Types.ObjectId,
        ref: 'Promo'
    }]
}, {
    timestamps: true,
});
module.exports = mongoose.model('Department', DepartmentSchema);

let Place = require('./Place');
let Client = require('./Client');
let Promo = require('./Promo');
DepartmentSchema.pre('remove', async function (next) {
    await Client.update(
        {departments: this._id},
        {$pull: {departments: this._id}},
        {multi: true});
    await Place.update(
        {departments: this._id},
        {$pull: {departments: this._id}},
        {multi: true});
    let promos = await Promo.find({client: this._id});
    promos.forEach(function (promo) {
        promo.remove();
    });
    next();
});
DepartmentSchema.pre('save', async function (next) {
    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);
    if (client && place) {
        client.departments.push(this);
        place.departments.push(this);
        client.save();
        place.save();
        if (this.promos){
            this.promos.forEach(async function (promoId) {
                let promo = await Promo.findById(promoId);
                promo.departments.push(this);
                promo.save();
            });
        }
        next();
    }
    let msg = 'Not found model:';
    if (!client){
        msg += 'Client ';
    }
    if (!place){
        msg += 'Place';
    }
    next(new Error(msg));
});