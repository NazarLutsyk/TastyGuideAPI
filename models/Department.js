let mongoose = require('mongoose');
let ROLES = require(global.paths.CONFIG + '/roles');

let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
    roles: {
        type: [String],
        default: [ROLES.PLACE_ROLES.ADMIN_ROLE]
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
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
    try {
        await Client.update(
            {departments: this._id},
            {$pull: {departments: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Place.update(
            {departments: this._id},
            {$pull: {departments: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Promo.update(
            {author: this._id},
            {author: null},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
DepartmentSchema.pre('save', async function (next) {
    let self = this;
    try {
        let client = await Client.findById(this.client);
        let place = await Place.findById(this.place);
        let promos = await Promo.find({_id: this.promos});
        this.client = client ? client._id : null;
        this.place = place ? place._id : null;
        this.promos = [];
        if (client && client.departments.indexOf(this._id) == -1) {
            await Client.findByIdAndUpdate(client._id, {$push: {departments: this}}, {
                runValidators: true,
                context: 'query'
            });
        }
        if (place && place.departments.indexOf(this._id) == -1) {
            await Place.findByIdAndUpdate(place._id, {$push: {departments: this}}, {
                runValidators: true,
                context: 'query'
            });
        }
        if (promos) {
            promos.forEach(function (promo) {
                self.promos.push(promo._id);
            });
            promos.forEach(async function (promo) {
                if (promo.departments.indexOf(self._id) == -1) {
                    return await Promo.findByIdAndUpdate(promo._id, {author: self}, {
                        runValidators: true,
                        context: 'query'
                    });
                } else {
                    return;
                }
            });
        }
        return next();
    } catch (e) {
        return next(e);
    }
});