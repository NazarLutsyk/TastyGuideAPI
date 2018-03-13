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

module.exports = mongoose.model('Client', ClientSchema);

let Complaint = require('./Complaint');
let DrinkApplication = require('./DrinkApplication');
let Place = require('./Place');
let Rating = require('./Rating');
let Department = require('./Department');
ClientSchema.pre('remove', async function (next) {
    try {
        let complaints = await Complaint.find({client: this._id});
        let drinkApplications = await DrinkApplication.find({client: this._id});
        let ratings = await Rating.find({client: this._id});
        let departments = await Department.find({client: this._id});
        let ownPlaces = await Place.find({boss: this._id});

        await complaints.forEach(async function (complaint) {
            return await complaint.remove();
        });
        await drinkApplications.forEach(async function (drinkApplication) {
            return await drinkApplication.remove();
        });
        await ratings.forEach(async function (rating) {
            return await rating.remove();
        });
        await departments.forEach(async function (department) {
            return await department.remove();
        });
        await Place.update({_id: this.ownPlaces}, {boss: null}, {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});

ClientSchema.pre('save', async function (next) {
    try {
        let self = this;
        if (this.ownPlaces) {
            let places = await Place.find({_id: this.ownPlaces});
            this.ownPlaces = [];
            if (places) {
                places.forEach(function (place) {
                    self.ownPlaces.push(place._id);
                });
                places.forEach(async function (place) {
                    if (place.boss) {
                        return self.ownPlaces.splice(self.ownPlaces.indexOf(place), 1);
                    } else {
                        return await Place.findByIdAndUpdate(place._id, {boss: self}, {
                            runValidators: true,
                            context: 'query'
                        });
                    }
                });
            }
        }
        if (this.drinkApplications) {
            let apps = await DrinkApplication.find({_id: this.drinkApplications});
            this.drinkApplications = [];
            if (apps) {
                apps.forEach(function (app) {
                    self.drinkApplications.push(app._id);
                });
                apps.forEach(async function (app) {
                    if (app.client) {
                        return self.drinkApplications.splice(self.drinkApplications.indexOf(app), 1);
                    } else {
                        return await DrinkApplication.findByIdAndUpdate(app._id, {organizer: self}, {runValidators: true});
                    }
                });
            }
        }
        if (this.ratings) {
            let ratings = await Rating.find({_id: this.ratings});
            this.ratings = [];
            if (ratings) {
                ratings.forEach(function (rating) {
                    self.ratings.push(rating._id);
                });
                ratings.forEach(async function (rating) {
                    if (rating.client) {
                        return self.ratings.splice(self.ratings.indexOf(rating), 1);
                    } else {
                        return await Rating.findByIdAndUpdate(rating._id, {client: self}, {runValidators: true});
                    }
                });
            }
        }
        if (this.complaints) {
            let complaints = await Rating.find({_id: this.complaints});
            this.complaints = [];
            if (complaints) {
                complaints.forEach(function (complaint) {
                    self.complaints.push(complaint._id);
                });
                complaints.forEach(async function (complaint) {
                    if (complaint.client) {
                        return self.complaints.splice(self.complaints.indexOf(complaint), 1);
                    } else {
                        return await Complaint.findByIdAndUpdate(complaint._id, {client: self}, {runValidators: true});
                    }
                });
            }
        }
        if (this.departments) {
            let departments = await Department.find({_id: this.departments});
            this.departments = [];
            if (departments) {
                departments.forEach(function (department) {
                    self.departments.push(department._id);
                });
                departments.forEach(async function (department) {
                    if (department.client) {
                        return self.departments.splice(self.departments.indexOf(department), 1);
                    } else {
                        return await Department.findByIdAndUpdate(department._id, {client: self}, {
                            runValidators: true,
                            context: 'query'
                        });
                    }
                });
            }
        }
        return next();
    } catch (e) {
        return next(e);
    }
});