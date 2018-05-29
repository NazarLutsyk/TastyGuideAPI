let mongoose = require("mongoose");
let ROLES = require("../config/roles");

let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
    roles: {
        type: [String],
        default: [ROLES.PLACE_ROLES.ADMIN_ROLE]
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place",
        required: true
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},
});

DepartmentSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

DepartmentSchema.methods.supersave = async function () {
    let Place = require("./Place");
    let Client = require("./Client");

    let client = await Client.findById(this.client);
    let place = await Place.findById(this.place);

    if (!client) {
        throw new Error("Not found related model Client!");
    }
    if (!place) {
        throw new Error("Not found related model Place!");
    }
    let alreadyExists = await departmentModel.count({
        client: this.client,
        place: this.place,
    });
    if (alreadyExists) {
        throw new Error("Already exists!");
    } else {
        log("save Department");
        return await this.save();
    }
};

DepartmentSchema.methods.superupdate = async function (newDoc) {
    let objectHelper = require("../helpers/objectHelper");
    if (newDoc.place || newDoc.client) {
        throw new Error("Can`t update relations!");
    }

    let alreadyExists = await departmentModel.count({
        client: newDoc.client,
        place: newDoc.place,
    });
    if (alreadyExists) {
        throw new Error("Already exists!");
    } else {
        objectHelper.load(this, newDoc);
        log("update Department");
        return await this.save();
    }
};

let departmentModel = mongoose.model("Department", DepartmentSchema);
module.exports = departmentModel;

DepartmentSchema.pre("remove", async function (next) {
    log("remove Department");
    return next();
});