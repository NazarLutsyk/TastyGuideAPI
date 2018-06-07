let Client = require("../../models/Client");
let GoogleTokenStrategy = require("passport-google-token").Strategy;
let SOCIAL = require('../social');

module.exports.Auth = new GoogleTokenStrategy({
    clientID: SOCIAL.GOOGLE.CLIENT_ID,
    clientSecret: SOCIAL.GOOGLE.CLIENT_SECRET
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
            user.email = profile.emails[0] ? profile.emails[0].value : '';
            user.avatar = profile._json.picture;
            user = await user.save();
            return done(null, user);
        } else {
            let user = await Client.create({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                googleId: profile.id,
                email: profile.emails[0] ? profile.emails[0].value : '',
                avatar: profile._json.picture
            });
            log("create client");
            return done(null, user);
        }
    } catch (e) {
        done(e);
    }

});