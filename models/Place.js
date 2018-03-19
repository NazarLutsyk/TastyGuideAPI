let mongoose = require('mongoose');
let path = require('path');

let Schema = mongoose.Schema;

let PlaceSchema = new Schema({
    phone: {
        type: String,
        required: true,
        match: /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    averagePrice: {
        type: Number,
        default: 0,
        validate: {
            validator: function (averagePrice) {
                return averagePrice >= 0;
            },
            message: 'Min avaragePrive eq 0'
        }
    },
    reviews: {
        type: Number,
        default: 0
    },
    allowed: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
    },
    images: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Image'
        }]
    },
    boss: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    types: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceType'
    }],
    promos: [{
        type: Schema.Types.ObjectId,
        ref: 'Promo'
    }],
    complaints: [{
        type: Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    drinkApplications: [{
        type: Schema.Types.ObjectId,
        ref: 'DrinkApplication'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    departments: [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }],
    multilang: [{
        type: Schema.Types.ObjectId,
        ref: 'PlaceMultilang',
    }],
    days: [{
        type: Schema.Types.ObjectId,
        ref: 'Day'
    }],
    hashTags: [{
        type: Schema.Types.ObjectId,
        ref: 'HashTag'
    }],
    tops: [{
        type: Schema.Types.ObjectId,
        ref: 'TopPlace'
    }]
}, {
    timestamps: true,
});

PlaceSchema.methods.supersave = async function (context) {
    let Complaint = require('./Complaint');
    let DrinkApplication = require('./DrinkApplication');
    let Rating = require('./Rating');
    let Department = require('./Department');
    let TopPlace = require('./TopPlace');
    let Day = require('./Day');
    let Promo = require('./Promo');
    let HashTag = require('./HashTag');
    let Multilang = require('./PlaceMultilang');
    let Location = require('./Location');
    let PlaceType = require('./PlaceType');
    let Client = require('./Client');

    let client = await Client.findById(this.boss);
    let placeTypeExists = await PlaceType.count(this.types);
    let promoExists = await Promo.count({_id: this.promos});
    let complaitnsExists = await Complaint.count({_id: this.complaints});
    let ratingsExists = await Rating.count({_id: this.ratings});
    let drinkAppExists = await DrinkApplication.count({_id: this.drinkApplications});
    let departmentsExists = await Department.count({_id: this.departments});
    let multilangExists = await Multilang.count({_id: this.multilang});
    let daysExists = await Day.count({_id: this.days});
    let topsExists = await TopPlace.count({_id: this.tops});
    let hashTagsExists = await HashTag.count({_id: this.hashTags});
    let location = await Location.findById(this.location);

    if (!location && this.location) {
        throw new Error('Not found related model Location!');
    } else if (location) {
        await context.update(
            {location: this.location},
            {location: null},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Location.findByIdAndUpdate(location._id, {place: this._id}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    if (!client && this.client) {
        throw new Error('Not found related model Client!');
    } else if (client) {
        await Client.findByIdAndUpdate(client._id, {$push: {ownPlaces: this._id}}, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    if ((placeTypeExists === 0 && this.types.length !== 0) || (placeTypeExists !== this.types.length)) {
        throw new Error('Not found related model PlaceType!');
    }

    if ((hashTagsExists === 0 && this.hashTags.length !== 0) || (hashTagsExists !== this.hashTags.length)) {
        throw new Error('Not found related model HashTag!');
    } else if (hashTagsExists === this.hashTags.length) {
        await HashTag.update({_id: this.hashTags}, {$addToSet: {places: this}}, {multi: true, runValidators: true});
    }

    if (this.promos.length > 0 && this.promos.length !== promoExists) {
        throw new Error('Not found related model Promo!');
    } else if (promoExists === this.promos.length) {
        await context.update(
            {promos: {$in: this.promos}},
            {$pullAll: {promos: this.promos}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Promo.update({_id: this.promos}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.complaints.length > 0 && this.complaints.length !== complaitnsExists) {
        throw new Error('Not found related model Complaint!');
    } else if (complaitnsExists === this.complaints.length) {
        await context.update(
            {complaints: {$in: this.complaints}},
            {$pullAll: {complaints: this.complaints}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Complaint.update({_id: this.complaints}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.ratings.length > 0 && this.ratings.length !== ratingsExists) {
        throw new Error('Not found related model Rating!');
    } else if (ratingsExists === this.ratings.length) {
        await context.update(
            {ratings: {$in: this.ratings}},
            {$pullAll: {ratings: this.ratings}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Rating.update({_id: this.ratings}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.drinkApplications.length > 0 && this.drinkApplications.length !== drinkAppExists) {
        throw new Error('Not found related model Drink Application!');
    } else if (drinkAppExists === this.drinkApplications.length) {
        await context.update(
            {drinkApplications: {$in: this.drinkApplications}},
            {$pullAll: {drinkApplications: this.drinkApplications}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await DrinkApplication.update({_id: this.drinkApplications}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.departments.length > 0 && this.departments.length !== departmentsExists) {
        throw new Error('Not found related model Drink Department!');
    } else if (departmentsExists === this.departments.length) {
        await context.update(
            {departments: {$in: this.departments}},
            {$pullAll: {departments: this.departments}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Department.update({_id: this.departments}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.multilang.length > 0 && this.multilang.length !== multilangExists) {
        throw new Error('Not found related model Multilang!');
    } else if (multilangExists === this.multilang.length) {
        await context.update(
            {multilang: {$in: this.multilang}},
            {$pullAll: {multilang: this.multilang}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Multilang.update({_id: this.multilang}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.days.length > 0 && this.days.length !== daysExists) {
        throw new Error('Not found related model Day!');
    } else if (daysExists === this.days.length) {
        await context.update(
            {days: {$in: this.days}},
            {$pullAll: {days: this.days}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Day.update({_id: this.days}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    if (this.tops.length > 0 && this.tops.length !== topsExists) {
        throw new Error('Not found related model TopPlace!');
    } else if (topsExists === this.tops.length) {
        await context.update(
            {tops: {$in: this.tops}},
            {$pullAll: {tops: this.tops}},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await TopPlace.update({_id: this.tops}, {place: this._id}, {
            multi: true,
            runValidators: true,
            context: 'query'
        });
    }

    return await this.save();
};

PlaceSchema.methods.superupdate = async function (context, newDoc) {
    let Complaint = require('./Complaint');
    let DrinkApplication = require('./DrinkApplication');
    let Rating = require('./Rating');
    let Department = require('./Department');
    let TopPlace = require('./TopPlace');
    let Day = require('./Day');
    let HashTag = require('./HashTag');
    let Promo = require('./Promo');
    let Location = require('./Location');
    let Multilang = require('./PlaceMultilang');
    let Client = require('./Client');
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');

    if (newDoc.boss && newDoc.boss != this.boss) {
        let newClient = await Client.findById(newDoc.boss);
        if (newClient) {
            await Client.findByIdAndUpdate(this.boss, {$pull: {ownPlaces: this._id}}, {
                runValidators: true,
                context: 'query'
            });
            await Client.update(
                {_id: newClient._id},
                {$addToSet: {ownPlaces: this._id}},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Client!');
        }
    }
    if (newDoc.location && newDoc.location != this.location) {
        let newLocation = await Location.findById(newDoc.location);
        if (newLocation) {
            await context.update(
                {location: newDoc.location},
                {location: null},
                {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                }
            );
            await Location.findByIdAndUpdate(this.location, {place: null}, {runValidators: true, context: 'query'});
            await Location.update(
                {_id: newLocation._id},
                {place: this._id},
                {runValidators: true, context: 'query'});
        } else {
            throw new Error('Not found related model Location!');
        }
    }
    if (newDoc.hasOwnProperty('multilang')) {
        let count = await Multilang.count({_id: newDoc.multilang});
        if (count === newDoc.multilang.length) {
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
                await Multilang.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {multilang: {$in: toAdd}},
                    {$pullAll: {multilang: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await Multilang.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model Multilang!');
        }
    }
    if (newDoc.hasOwnProperty('promos')) {
        let count = await Promo.count({_id: newDoc.promos});
        if (count === newDoc.promos.length) {
            let toAdd = [];
            let toRemove = [];
            for (let promo of newDoc.promos) {
                if (this.promos.indexOf(promo.toString()) === -1)
                    toAdd.push(promo);
            }
            for (let promo of this.promos) {
                if (newDoc.promos.indexOf(promo.toString()) === -1)
                    toRemove.push(promo);
            }
            if (toRemove)
                await Promo.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {promos: {$in: toAdd}},
                    {$pullAll: {promos: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await Promo.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model Promo!');
        }
    }
    if (newDoc.hasOwnProperty('tops')) {
        let count = await TopPlace.count({_id: newDoc.tops});
        if (count === newDoc.tops.length) {
            let toAdd = [];
            let toRemove = [];
            for (let top of newDoc.tops) {
                if (this.tops.indexOf(top.toString()) === -1)
                    toAdd.push(top);
            }
            for (let top of this.tops) {
                if (newDoc.tops.indexOf(top.toString()) === -1)
                    toRemove.push(top);
            }
            if (toRemove)
                await TopPlace.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {tops: {$in: toAdd}},
                    {$pullAll: {tops: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await TopPlace.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model TopPlace!');
        }
    }
    if (newDoc.hasOwnProperty('drinkApplications')) {
        let count = await DrinkApplication.count({_id: newDoc.drinkApplications});
        if (count === newDoc.drinkApplications.length) {
            let toAdd = [];
            let toRemove = [];
            for (let drinkApplication of newDoc.drinkApplications) {
                if (this.drinkApplications.indexOf(drinkApplication.toString()) === -1)
                    toAdd.push(drinkApplication);
            }
            for (let drinkApplication of this.drinkApplications) {
                if (newDoc.drinkApplications.indexOf(drinkApplication.toString()) === -1)
                    toRemove.push(drinkApplication);
            }
            if (toRemove)
                await DrinkApplication.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {drinkApplications: {$in: toAdd}},
                    {$pullAll: {drinkApplications: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await DrinkApplication.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model DrinkApplication!');
        }
    }
    if (newDoc.hasOwnProperty('ratings')) {
        let count = await Rating.count({_id: newDoc.ratings});
        if (count == newDoc.ratings.length) {
            let toAdd = [];
            let toRemove = [];
            for (let rating of newDoc.ratings) {
                if (this.ratings.indexOf(rating.toString()) === -1)
                    toAdd.push(rating);
            }
            for (let rating of this.ratings) {
                if (newDoc.ratings.indexOf(rating.toString()) === -1)
                    toRemove.push(rating);
            }
            if (toRemove)
                await Rating.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {ratings: {$in: toAdd}},
                    {$pullAll: {ratings: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await Rating.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model Rating!');
        }
    }
    if (newDoc.hasOwnProperty('complaints')) {
        let count = await Complaint.count({_id: newDoc.complaints});
        if (count === newDoc.complaints.length) {
            let toAdd = [];
            let toRemove = [];
            for (let complaint of newDoc.complaints) {
                if (this.complaints.indexOf(complaint.toString()) === -1)
                    toAdd.push(complaint);
            }
            for (let complaint of this.complaints) {
                if (newDoc.complaints.indexOf(complaint.toString()) === -1)
                    toRemove.push(complaint);
            }
            if (toRemove)
                await Complaint.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {complaints: {$in: toAdd}},
                    {$pullAll: {complaints: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await Complaint.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model Complaint!');
        }
    }
    if (newDoc.hasOwnProperty('departments')) {
        let count = await Department.count({_id: newDoc.departments});
        if (count === newDoc.departments.length) {
            let toAdd = [];
            let toRemove = [];
            for (let department of newDoc.departments) {
                if (this.departments.indexOf(department.toString()) === -1)
                    toAdd.push(department);
            }
            for (let department of this.departments) {
                if (newDoc.departments.indexOf(department.toString()) === -1)
                    toRemove.push(department);
            }
            if (toRemove)
                await Department.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {departments: {$in: toAdd}},
                    {$pullAll: {departments: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await Department.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model Department!');
        }
    }
    if (newDoc.hasOwnProperty('hashTags')) {
        let count = await HashTag.count({_id: newDoc.hashTags});
        if (count === newDoc.hashTags.length) {
            let toAdd = [];
            let toRemove = [];
            for (let hashTag of newDoc.hashTags) {
                if (this.hashTags.indexOf(hashTag.toString()) === -1)
                    toAdd.push(hashTag);
            }
            for (let hashTags of this.hashTags) {
                if (newDoc.hashTags.indexOf(hashTags.toString()) === -1)
                    toRemove.push(hashTags);
            }
            if (toRemove)
                await HashTag.update({_id: {$in: toRemove}}, {$pull: {places: this._id}}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await HashTag.update({_id: {$in: toAdd}}, {$addToSet: {places: this._id}}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.hasOwnProperty('days')) {
        let count = await Day.count({_id: newDoc.days});
        if (count === newDoc.days.length) {
            let toAdd = [];
            let toRemove = [];
            for (let day of newDoc.days) {
                if (this.days.indexOf(day.toString()) === -1)
                    toAdd.push(day);
            }
            for (let days of this.days) {
                if (newDoc.days.indexOf(days.toString()) === -1)
                    toRemove.push(days);
            }
            if (toRemove)
                await Day.update({_id: {$in: toRemove}}, {place: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {days: {$in: toAdd}},
                    {$pullAll: {days: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
            await Day.update({_id: {$in: toAdd}}, {place: this._id}, {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        } else {
            throw new Error('Not found related model Department!');
        }
    }


    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('Place', PlaceSchema);

let Complaint = require('./Complaint');
let DrinkApplication = require('./DrinkApplication');
let Rating = require('./Rating');
let Department = require('./Department');
let TopPlace = require('./TopPlace');
let Day = require('./Day');
let Promo = require('./Promo');
let HashTag = require('./HashTag');
let Multilang = require('./PlaceMultilang');
let Location = require('./Location');
let Client = require('./Client');
PlaceSchema.pre('remove', async function (next) {
    try {
        let complaints = await Complaint.remove({place: this._id});
        let drinkApplications = await DrinkApplication.remove({place: this._id});
        let ratings = await Rating.remove({place: this._id});
        let departments = await Department.remove({place: this._id});
        let topPlaces = await TopPlace.remove({place: this._id});
        let days = await Day.remove({place: this._id});
        let promos = await Promo.remove({place: this._id});
        let locations = await Location.remove({location: this._id});
        let multilangs = await Multilang.remove({place: this._id});
        await HashTag.update(
            {places: this._id},
            {$pull: {places: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Client.update(
            {ownPlaces: this._id},
            {$pull: {ownPlaces: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Client.update(
            {favoritePlaces: this._id},
            {$pull: {favoritePlaces: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});