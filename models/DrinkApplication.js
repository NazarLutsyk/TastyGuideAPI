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
        type: Number,
        default: 0,
        validate: {
            validator: function (budged) {
                return budged >= 0;
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
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('DrinkApplication', DrinkApplicationSchema);

let Place = require('./Place');
let Client = require('./Client');
DrinkApplicationSchema.pre('remove', async function (next) {
    try {
        await Client.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        await Place.update(
            {drinkApplications: this._id},
            {$pull: {drinkApplications: this._id}},
            {multi: true, runValidators: true, context: 'query'});
        return next();
    } catch (e) {
        return next(e);
    }
});
DrinkApplicationSchema.pre('save', async function (next) {
    try {
        let client = await Client.findById(this.organizer);
        let place = await Place.findById(this.place);
        if ((!client && this.organizer != null) &&
            (!place && this.place != null)) {
            return next(new Error('Not found related model!'));
        } else {
            if (client && client.drinkApplications.indexOf(this._id) == -1) {
                await Client.findByIdAndUpdate(client._id, {$push: {drinkApplications: this}}, {
                    runValidators: true,
                    context: 'query'
                });
            }
            if (place && place.drinkApplications.indexOf(this._id) == -1) {
                await Place.findByIdAndUpdate(place._id, {$push: {drinkApplications: this}}, {
                    runValidators: true,
                    context: 'query'
                });
            }
            return next();
        }
    } catch (e) {
        return next(e);
    }
});

