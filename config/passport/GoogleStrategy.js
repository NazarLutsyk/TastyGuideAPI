let GoogleStrategy = require('passport-google-oauth20').Strategy;
let Client = require('../../models/Client');
let config = require('../config');

exports.Auth = new GoogleStrategy({
    clientID: config.GOOGLE.CLIENT_ID,
    clientSecret: config.GOOGLE.CLIENT_SECRET,
    callbackURL: config.GOOGLE.CALLBACK_URL,
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        let isExists = await Client.count({
            googleId: profile.id
        });
        if (isExists) {
            let user = await Client.findOne({
                googleId: profile.id
            });
            return cb(null, user);
        } else {
            let user = await Client.create({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                googleId: profile.id,
                email: profile.emails[0].value || ''
            });
            return cb(null, user);
        }
    } catch (e) {
        console.log(e);
        cb(e);
    }
});
