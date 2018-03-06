let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DrinkApplicationSchema = new Schema({
    friends: {
        type: String,
        default: 'NONE'
    },
    goal: {
        type: String,
        default: 'NONE'
    },
    budged: {
        type: String,
        default: 0,
        validate: {
            validator: function () {
                return this.budged >= 0;
            },
            message: 'Min budget eq 0'
        }
    },
    date: {
        type: Date,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        // required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        // required: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('DrinkApplication', DrinkApplicationSchema);

let Place = require('./Place');
let Client = require('./Client');
DrinkApplicationSchema.pre('remove',async function (next) {
    try {
        await Client.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true});
        await Place.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true});
        return next();
    } catch (e) {
        return next(e);
    }
});
DrinkApplicationSchema.pre('save', async function (next) {
    try {
        let client = await Client.findById(this.organizer);
        let place = await Place.findById(this.place);
        this.organizer = client ? client._id : '';
        this.place = place ? place._id : '';
        if (client && client.drinkApplications.indexOf(this._id) == -1) {
            return await Client.findByIdAndUpdate(client._id,{$push : {drinkApplications : this}});
        }
        if (place && place.drinkApplications.indexOf(this._id) == -1) {
            return await Place.findByIdAndUpdate(place._id,{$push : {drinkApplications : this}});
        }
        return next();
    } catch (e) {
        return next(e);
    }
});

