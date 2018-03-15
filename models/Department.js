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

DepartmentSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Client = require('./Client');
    let Promo = require('./Promo');

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);


    let count = await Promo.count({_id: this.promos});

    if ((count === 0 && this.promos.length !== 0) || (count !== this.promos.length)) {
        throw new Error('Not found related model Promo!');
    } else if (count === this.promos.length) {
        await Promo.update({_id: this.promos}, {author: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }
    if (!client && this.client) {
        throw new Error('Not found related model Client!');
    }
    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else {
        if (client) {
            await Client.findByIdAndUpdate(client._id, {$push: {departments: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
        if (place) {
            await Place.findByIdAndUpdate(place._id, {$push: {departments: this._id}}, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        }
    }
    return await this.save();
};

DepartmentSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Place = require('./Place');
    let Client = require('./Client');
    let Promo = require('./Promo');

    if (newDoc.hasOwnProperty('promos')) {
        let count = await Promo.count({_id: newDoc.promos});
        if (count == newDoc.promos.length) {
            let toAdd = [];
            let toRemove = [];
            for (let promos of newDoc.promos) {
                if (this.promos.indexOf(promos) == -1)
                    toAdd.push(promos);
            }
            for (let promos of this.promos) {
                if (newDoc.promos.indexOf(promos) != -1)
                    toRemove.push(promos);
            }
            if (toRemove)
                await Promo.update({_id: {$in: toRemove}}, {author: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await Promo.update({_id: {$in: toAdd}}, {author: this._id}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {departments: this._id}},{runValidators: true, context: 'query'});
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {departments: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.client && newDoc.client != this.client) {
        let newClient = await Client.findById(newDoc.client);
        if (newClient) {
            await Client.findByIdAndUpdate(this.client, {$pull: {departments: this._id}},{runValidators: true, context: 'query'});
            await Client.update(
                {_id: newClient._id},
                {$addToSet: {departments: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Client!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

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