let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Promo = require('./Promo');

let EventSchema = new Schema({
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'EventMultilang'
    }],
}, {
    discriminatorKey: 'kind'
});

EventSchema.methods.supersave = async function () {
    let Department = require('./Department');
    let EventMultilang = require('./EventMultilang');
    let Place = require('./Place');
    let Image = require('./Image');

    let author = await Department.findById(this.author);
    let place = await Place.findById(this.place);
    let newsMultilangExists = await EventMultilang.count({_id: this.multilang});
    let image = await Image.findById(this.image);

    if ((newsMultilangExists === 0 && this.multilang.length !== 0) || (newsMultilangExists !== this.multilang.length)) {
        throw new Error('Not found related model EventMultilang!');
    } else if (newsMultilangExists === this.multilang.length) {
        await EventMultilang.update({_id: this.multilang}, {event: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }
    if (!author && this.author) {
        throw new Error('Not found related model Department!');
    } else if (author) {
        await Department.findByIdAndUpdate(author._id, {$push: {promos: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    } else if (place) {
        await Place.findByIdAndUpdate(place._id, {$push: {promos: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    if (!image && this.image) {
        throw new Error('Not found related model Place!');
    }

    return await this.save();
};

EventSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    let Department = require('./Department');
    let EventMultilang = require('./EventMultilang');
    let Place = require('./Place');
    let Image = require('./Image');
    if (newDoc.author && newDoc.author != this.author) {
        let newDepartment = await Department.findById(newDoc.author);
        if (newDepartment) {
            await Department.findByIdAndUpdate(this.author, {$pull: {promos: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Department.update(
                {_id: newDepartment._id},
                {$addToSet: {promos: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Department!');
        }
    }
    if (newDoc.place && newDoc.place != this.place) {
        let newPlace = await Place.findById(newDoc.place);
        if (newPlace) {
            await Place.findByIdAndUpdate(this.place, {$pull: {promos: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Place.update(
                {_id: newPlace._id},
                {$addToSet: {promos: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.hasOwnProperty('multilang')) {
        let count = await EventMultilang.count({_id: newDoc.multilang});
        if (count == newDoc.multilang.length) {
            let toAdd = [];
            let toRemove = [];
            for (let multilang of newDoc.multilang) {
                if (this.multilang.indexOf(multilang.toString()) === -1)
                    toAdd.push(multilang);
            }
            for (let multilang of this.multilang) {
                if (newDoc.multilang.indexOf(multilang.toString()) === -1)
                    toRemove.push(multilang);
            }
            if (toRemove)
                await EventMultilang.update({_id: {$in: toRemove}}, {event: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await EventMultilang.update({_id: {$in: toAdd}}, {event: this._id}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
        } else {
            throw new Error('Not found related model multilang!');
        }
    }
    if (newDoc.image && newDoc.image != this.image) {
        let imageExists = await Image.count({_id: newDoc.image});
        if (!imageExists)
            throw new Error('Not found related model Image!');
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = Promo.discriminator('Event', EventSchema);

let Multilang = require('./EventMultilang');
let Place = require('./Place');
let Department = require('./Department');
EventSchema.pre('remove', async function (next) {
    try {
        await Multilang.remove({event : this._id});
        await Place.update(
            {promos : this._id},
            {$pull : {promos : this._id}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        await Department.update(
            {promos : this._id},
            {$pull : {promos : this._id}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        return next();
    } catch (e) {
        return next(e);
    }
});