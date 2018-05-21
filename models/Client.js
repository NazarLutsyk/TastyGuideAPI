let mongoose = require("mongoose");
let bcrypt = require("bcrypt-nodejs");

let ROLES = require("../config/roles");
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
            message: "Password min length eq 4"
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
    favoritePlaces: [{
        type: Schema.Types.ObjectId,
        ref: "Place"
    }],
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true},
});

ClientSchema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "author",
    justOne: false
});
ClientSchema.virtual("news", {
    ref: "News",
    localField: "_id",
    foreignField: "author",
    justOne: false
});
ClientSchema.virtual("bonuses", {
    ref: "Bonuse",
    localField: "_id",
    foreignField: "author",
    justOne: false
});

ClientSchema.virtual("complaints", {
    ref: "Complaint",
    localField: "_id",
    foreignField: "client",
    justOne: false
});
ClientSchema.virtual("drinkApplications", {
    ref: "DrinkApplication",
    localField: "_id",
    foreignField: "organizer",
    justOne: false
});
ClientSchema.virtual("ratings", {
    ref: "Rating",
    localField: "_id",
    foreignField: "client",
    justOne: false
});
ClientSchema.virtual("departments", {
    ref: "Department",
    localField: "_id",
    foreignField: "client",
    justOne: false
});

/*ClientSchema.virtual("sendedMessages", {
    ref: "Message",
    localField: "_id",
    foreignField: "sender",
    justOne: false
});
ClientSchema.virtual("receivedMessages", {
    ref: "Message",
    localField: "_id",
    foreignField: "receiver",
    justOne: false
});*/

ClientSchema.statics.notUpdatable = function () {
    return ["roles", "avatar", "facebookId", "googleId"];
};

ClientSchema.statics.superfind = async function (params) {
    let {universalFind} = require("../helpers/mongoQueryHelper");
    return await universalFind(this, params);
};

ClientSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
ClientSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
ClientSchema.statics.notUpdatable = function () {
    return ["avatar", "roles"];
};
ClientSchema.methods.superupdate = async function (newDoc) {
    let Place = require("./Place");
    let objectHelper = require("../helpers/objectHelper");

    if (newDoc.hasOwnProperty("favoritePlaces")) {
        let count = await Place.count({_id: newDoc.favoritePlaces});
        if (count !== newDoc.favoritePlaces.length) {
            throw new Error("Not found related model Place!");
        }
    }
    objectHelper.load(this, newDoc);
    log("update Client");
    return await this.save();
};

module.exports = mongoose.model("Client", ClientSchema);

let Complaint = require("./Complaint");
let DrinkApplication = require("./DrinkApplication");
let Rating = require("./Rating");
let Department = require("./Department");
let Message = require("./Message");
let Promo = require("./Promo");
ClientSchema.pre("remove", async function (next) {
    try {
        let complaints = await Complaint.find({client: this._id});
        let drinkApps = await DrinkApplication.find({organizer: this._id});
        let ratings = await Rating.find({client: this._id});
        let departments = await Department.find({client: this._id});
        let sended = await Message.find({sender: this._id});
        let received = await Message.find({receiver: this._id});
        for (const complaint of complaints) {
            await complaint.remove();
        }
        for (const drinkApp of drinkApps) {
            await drinkApp.remove();
        }
        for (const rating of ratings) {
            await rating.remove();
        }
        for (const department of departments) {
            await department.remove();
        }
        for (const message of sended) {
            await message.remove();
        }
        for (const message of received) {
            await message.remove();
        }
        await Promo.update(
            {author: this._id},
            {author: null},
            {
                multi: true,
                runValidators: true,
                context: "query"
            });
        log("remove Client");
        return next();
    } catch (e) {
        return next(e);
    }
});