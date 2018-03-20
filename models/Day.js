let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DaySchema = new Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    holiday: {
        type: Boolean,
        default: false
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    }
}, {
    timestamps: true,
});

DaySchema.methods.supersave = async function () {
    let Place = require('./Place');

    let place = await Place.findById(this.place);

    if (!place && this.place) {
        throw new Error('Not found related model Place!');
    }
    return await this.save();
};
DaySchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require(global.paths.HELPERS + '/objectHelper');
    if (newDoc.place) {
        throw new Error('Can`t update relations!');
    }
    objectHelper.load(this, newDoc);
    return await this.save();
};


module.exports = mongoose.model('Day', DaySchema);