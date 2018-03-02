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
        default : path.join(__dirname,'default','default.jpg')
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
    let complaints = await Complaint.find({client: this._id});
    let drinkApplications = await DrinkApplication.find({client: this._id});
    let ratings = await Rating.find({client: this._id});
    let departments = await Department.find({client: this._id});
    let ownPlaces = await Place.find({boss: this._id});

    complaints.forEach(function (complaint) {
        complaint.remove();
    });
    drinkApplications.forEach(function (drinkApplication) {
        drinkApplication.remove();
    });
    ratings.forEach(function (rating) {
        rating.remove();
    });
    departments.forEach(function (department) {
        department.remove();
    });
    ownPlaces.forEach(function (place) {
        place.boss = null;
        place.save();
    });
    next();
});

ClientSchema.pre('save', async function (next) {
    if (this.ownPlaces) {
        let places = await Place.find({_id: this.ownPlaces});
        if (places) {
            places.forEach(function (place) {
                place.boss = this;
                place.save();
            });
            next();
        }
        let msg = 'Not found model:';
        if (!places) {
            msg += 'Places';
        }
        next(new Error(msg));
    } else {
        return next();
    }
});