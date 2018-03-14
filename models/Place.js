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
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
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
        let complaints = await Complaint.find({place: this._id});
        let drinkApplications = await DrinkApplication.find({place: this._id});
        let ratings = await Rating.find({place: this._id});
        let departments = await Department.find({place: this._id});
        let topPlaces = await TopPlace.find({place: this._id});
        let days = await Day.find({place: this._id});
        let promos = await Promo.find({place: this._id});
        let locations = await Location.remove({location: this._id});

        complaints.forEach(async function (complaint) {
            return await complaint.remove();
        });
        drinkApplications.forEach(async function (drinkApplication) {
            return await drinkApplication.remove();
        });
        ratings.forEach(async function (rating) {
            return await rating.remove();
        });
        departments.forEach(async function (department) {
            return await department.remove();
        });
        topPlaces.forEach(async function (topPlace) {
            return await topPlace.remove();
        });
        days.forEach(async function (day) {
            return await day.remove();
        });
        promos.forEach(async function (promo) {
            return await promo.remove();
        });
        this.multilang.forEach(async function (multId) {
            let mult = await Multilang.findById(multId);
            return await mult.remove();
        });
        await HashTag.update(
            {places: this._id},
            {$pull: {places: this._id}},
            {multi: true, runValidators: true,context:'query'});
        await Client.update(
            {ownPlaces: this._id},
            {$pull: {ownPlaces: this._id}},
            {multi: true, runValidators: true,context:'query'});
        await Client.update(
            {favoritePlaces: this._id},
            {$pull: {favoritePlaces: this._id}},
            {multi: true,runValidators: true,context:'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
//
// PlaceSchema.pre('save', async function (next) {
//     let self = this;
//     if (this.boss) {
//         let boss = await Client.findById(this.boss);
//         this.boss = boss ? boss._id : null;
//         if (boss && boss.ownPlaces.indexOf(this._id) == -1) {
//             await Client.findByIdAndUpdate(boss._id, {$push: {ownPlaces: self}},{runValidators: true,context:'query'});
//         }
//     }
//     if (this.hashTags) {
//         let hashTags = await HashTag.find({_id: this.hashTags});
//         this.hashTags = [];
//         if (hashTags) {
//             hashTags.forEach(function (hashTag) {
//                 self.hashTags.push(hashTag._id);
//             });
//             hashTags.forEach(async function (hashTag) {
//                 if (hashTag.places.indexOf(self._id) != -1) {
//                     return self.hashTags.splice(self.hashTags.indexOf(hashTag._id), 1);
//                 } else {
//                     return await HashTag.findByIdAndUpdate(hashTag._id, {$push: {places: self}},{runValidators: true,context:'query'});
//
//                 }
//             });
//         }
//     }
//     if (this.promos) {
//         let promos = await Promo.find({_id: this.promos});
//         this.promos = [];
//         if (promos) {
//             promos.forEach(function (promo) {
//                 self.promos.push(promo._id);
//             });
//             promos.forEach(async function (promo) {
//                 if (promo.place) {
//                     return self.promos.splice(self.promos.indexOf(promo), 1);
//                 } else {
//                     return await Promo.findByIdAndUpdate(promo._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     if (this.complaints) {
//         let complaints = await Complaint.find({_id: this.complaints});
//         this.complaints = [];
//         if (complaints) {
//             complaints.forEach(function (complaint) {
//                 self.complaints.push(complaint._id);
//             });
//             complaints.forEach(async function (complaint) {
//                 if (complaint.place) {
//                     return self.complaints.splice(self.complaints.indexOf(complaint), 1);
//                 } else {
//                     return await Complaint.findByIdAndUpdate(complaint._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     if (this.ratings) {
//         let ratings = await Rating.find({_id: this.ratings});
//         this.ratings = [];
//         if (ratings) {
//             ratings.forEach(function (rating) {
//                 self.ratings.push(rating._id);
//             });
//             ratings.forEach(async function (rating) {
//                 if (rating.place) {
//                     return self.ratings.splice(self.ratings.indexOf(rating), 1);
//                 } else {
//                     return await Rating.findByIdAndUpdate(rating._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     if (this.departments) {
//         let departments = await Department.find({_id: this.departments});
//         this.departments = [];
//         if (departments) {
//             departments.forEach(function (department) {
//                 self.departments.push(department._id);
//             });
//             departments.forEach(async function (department) {
//                 if (department.place) {
//                     return self.departments.splice(self.departments.indexOf(department), 1);
//                 } else {
//                     return await Department.findByIdAndUpdate(department._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     if (this.multilang) {
//         let multilangs = await Multilang.find({_id: this.multilang});
//         this.multilang = [];
//         if (multilangs) {
//             multilangs.forEach(function (multilang) {
//                 self.multilang.push(multilang._id);
//             });
//             multilangs.forEach(async function (multilang) {
//                 if (multilang.place) {
//                     return self.multilang.splice(self.multilang.indexOf(multilang), 1);
//                 } else {
//                     return await Multilang.findByIdAndUpdate(multilang._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     if (this.days) {
//         let days = await Day.find({_id: this.days});
//         this.days = [];
//         if (days) {
//             days.forEach(function (day) {
//                 self.days.push(day._id);
//             });
//             days.forEach(async function (day) {
//                 if (day.place) {
//                     return self.days.splice(self.days.indexOf(day), 1);
//                 } else {
//                     return await Day.findByIdAndUpdate(day._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     if (this.tops) {
//         let tops = await TopPlace.find({_id: this.tops});
//         this.tops = [];
//         if (tops) {
//             tops.forEach(function (top) {
//                 self.tops.push(top._id);
//             });
//             tops.forEach(async function (top) {
//                 if (top.place) {
//                     return self.tops.splice(self.tops.indexOf(top), 1);
//                 } else {
//                     return await TopPlace.findByIdAndUpdate(top._id, {place: self},{runValidators: true,context:'query'});
//                 }
//             });
//         }
//     }
//     return next();
// });

