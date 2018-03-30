let mongoose = require('mongoose');
let ROLES = require('../config/roles');

let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
    roles: {
        type: [String],
        default: [ROLES.PLACE_ROLES.ADMIN_ROLE]
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    }
}, {
    timestamps: true,
});

DepartmentSchema.methods.supersave = async function () {
    let Place = require('./Place');
    let Client = require('./Client');

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);

    if (!client) {
        throw new Error('Not found related model Client!');
    }
    if (!place) {
        throw new Error('Not found related model Place!');
    }
    log('save Department');
    return await this.save();
};

DepartmentSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require('../helpers/objectHelper');
    if (newDoc.place || newDoc.client) {
        throw new Error('Can`t update relations!');
    }
    objectHelper.load(this, newDoc);
    log('update Department');
    return await this.save();
};

module.exports = mongoose.model('Department', DepartmentSchema);

DepartmentSchema.pre('remove', async function (next) {
    log('remove Department');
    return next();
});