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
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
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
DrinkApplicationSchema.pre('remove', async function (next) {
    await Client.update(
        {drinkApplications: this._id},
        {$pull: {drinkApplications: this._id}},
        {multi: true});
    await Place.update(
        {drinkApplications: this._id},
        {$pull: {drinkApplications: this._id}},
        {multi: true});
    next();
});
DrinkApplicationSchema.pre('save', async function (next) {
    let client = await Client.findById(this.organizer);
    let place = await Place.findById(this.place);
    if (client && place) {
        client.drinkApplications.push(this);
        place.drinkApplications.push(this);
        client.save();
        place.save();
        next();
    }
    let msg = 'Not found model:';
    if (!client){
        msg += 'Client ';
    }
    if (!place){
        msg += 'Place';
    }
    next(new Error(msg));
});

