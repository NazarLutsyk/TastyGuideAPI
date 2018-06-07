let Client = require("../../models/Client");
var GoogleTokenStrategy = require("passport-google-token");

module.exports.Auth = new GoogleTokenStrategy({
    clientID: '637559649087-ev0cud8le919q9ffi8cn644sgp206687.apps.googleusercontent.com',
    clientSecret: 'AIzaSyDC92JdAld7twBLILsYN5J1NXZ1yJ2VIw8'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        let isExists = await Client.count({
            googleId: profile.id
        });
        if (isExists) {
            let user = await Client.findOne({
                googleId: profile.id
            });
            user.name = profile.name.givenName;
            user.surname = profile.name.familyName;
            user.email = profile.emails[0].value || "";
            user.avatar = profile._json.image.url;
            user = await user.save();
            return cb(null, user);
        } else {
            let user = await Client.create({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                googleId: profile.id,
                email: profile.emails[0].value || "",
                avatar: profile._json.image.url
            });
            log("create client");
            return cb(null, user);
        }
    } catch (e) {
        cb(e);
    }

});