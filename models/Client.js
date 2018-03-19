let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let path = require('path');
let ROLES = require('../config/roles');
let Schema = mongoose.Schema;

let ClientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    login: {
        type: String,
    },
    password: {
        type: String,
        validate: {
            validator: function () {
                return this.password.length >= 4;
            },
            message: 'Password min length eq 4'
        }
    },
    facebookId: String,
    googleId: String,
    city: {
        type: String,
    },
    phone: {
        type: String,
        match: /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/
    },
    email: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    avatar: {
        type: String,
    },
    roles: {
        type: Array,
        default: [ROLES.GLOBAL_ROLES.USER_ROLE]
    },
    ownPlaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Place'
    }],
    drinkApplications: [{
        type: Schema.Types.ObjectId,
        ref: 'DrinkApplication'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    complaints: [{
        type: Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    departments: [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }],
    favoritePlaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Place'
    }],
}, {
    timestamps: true,
});
ClientSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
ClientSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
ClientSchema.methods.superupdate = async function (context,newDoc) {
    let Place = require('./Place');
    let DrinkApplication = require('./DrinkApplication');
    let Rating = require('./Rating');
    let Complaint = require('./Complaint');
    let Department = require('./Department');
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');

    if (newDoc.hasOwnProperty('ownPlaces')) {
        let count = await Place.count({_id: newDoc.ownPlaces});
        if (count == newDoc.ownPlaces.length) {
            let toAdd = [];
            let toRemove = [];
            for (let ownPlaces of newDoc.ownPlaces) {
                if (this.ownPlaces.indexOf(ownPlaces.toString()) === -1)
                    toAdd.push(ownPlaces);
            }
            for (let ownPlaces of this.ownPlaces) {
                if (newDoc.ownPlaces.indexOf(ownPlaces.toString()) === -1)
                    toRemove.push(ownPlaces);
            }
            if (toRemove)
                await Place.update({_id: {$in: toRemove}}, {boss: null}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
            if (toAdd)
                await context.update(
                    {ownPlaces: {$in: toAdd}},
                    {$pullAll: {ownPlaces: toAdd}},
                    {
                        multi: true,
                        runValidators: true,
                        context: 'query'
                    }
                );
                await Place.update({_id: {$in: toAdd}}, {boss: this._id}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
        } else {
            throw new Error('Not found related model Place!');
        }
    }
    if (newDoc.hasOwnProperty('drinkApplications')) {
        let count = await DrinkApplication.count({_id: newDoc.drinkApplications});
        if (count == newDoc.drinkApplications.length) {
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
                await DrinkApplication.update({_id: {$in: toRemove}}, {organizer: null}, {
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
                await DrinkApplication.update({_id: {$in: toAdd}}, {organizer: this._id}, {
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
                await Rating.update({_id: {$in: toRemove}}, {client: null}, {
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
                await Rating.update({_id: {$in: toAdd}}, {client: this._id}, {
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
        if (count == newDoc.complaints.length) {
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
                await Complaint.update({_id: {$in: toRemove}}, {client: null}, {
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
                await Complaint.update({_id: {$in: toAdd}}, {client: this._id}, {
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
        if (count == newDoc.departments.length) {
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
                await Department.update({_id: {$in: toRemove}}, {client: null}, {
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
                await Department.update({_id: {$in: toAdd}}, {client: this._id}, {
                    multi: true,
                    runValidators: true,
                    context: 'query'
                });
        } else {
            throw new Error('Not found related model Department!');
        }
    }
    if (newDoc.hasOwnProperty('favoritePlaces')) {
        let count = await Place.count({_id: newDoc.favoritePlaces});
        if (!(count == newDoc.favoritePlaces.length)) {
            throw new Error('Not found related model Place!');
        }
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};

module.exports = mongoose.model('Client', ClientSchema);

let Complaint = require('./Complaint');
let DrinkApplication = require('./DrinkApplication');
let Place = require('./Place');
let Rating = require('./Rating');
let Department = require('./Department');
let Message = require('./Message');
ClientSchema.pre('remove', async function (next) {
    try {
        await Complaint.remove({client: this._id});
        await DrinkApplication.remove({organizer: this._id});
        await Rating.remove({client: this._id});
        await Department.remove({client: this._id});
        await Place.update(
            {boss: this._id},
            {boss: null},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            });
        await Message.update(
            {sender: this._id},
            {sender: null},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        await Message.update(
            {receiver: this._id},
            {receiver: null},
            {
                multi: true,
                runValidators: true,
                context: 'query'
            }
        );
        return next();
    } catch (e) {
        return next(e);
    }
});