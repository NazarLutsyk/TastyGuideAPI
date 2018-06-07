let Client = require("../../models/Client");
let FacebookTokenStrategy = require("passport-facebook-token");
let SOCIAL = require('../social');

module.exports.Auth = new FacebookTokenStrategy({
    clientID: SOCIAL.FACEBOOK.CLIENT_ID,
    clientSecret: SOCIAL.FACEBOOK.CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        let isExists = await Client.count({
            facebookId: profile.id
        });
        if (isExists) {
            let user = await Client.findOne({
                facebookId: profile.id
            });
            user.name = profile.name.givenName;
            user.surname = profile.name.familyName;
            user.email = profile.emails[0] ? profile.emails[0].value : '';
            user.avatar = profile.photos[0] ? profile.photos[0].value : '';
            user = await user.save();
            return done(null, user);
        } else {
            let user = await Client.create({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                facebookId: profile.id,
                email: profile.emails[0] ? profile.emails[0].value : '',
                avatar : profile.photos[0] ? profile.photos[0].value : '',
            });
            log('create client');
            return done(null, user);
        }
    } catch (e) {
        done(e);
    }
});