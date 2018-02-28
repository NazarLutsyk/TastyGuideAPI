let FacebookStrategy = require('passport-facebook').Strategy;
let Client = require('../../models/Client');
let config = require('../config');

exports.Auth = new FacebookStrategy({
    clientID: config.FACEBOOK.CLIENT_ID,
    clientSecret: config.FACEBOOK.CLIENT_SECRET,
    callbackURL: config.FACEBOOK.CALLBACK_URL,
    profileFields: ['id', 'name', 'email','photos']
}, async function (accessToken, refreshToken, profile, cb) {
    console.log(profile._json.picture.data);
    try {
        let isExists = await Client.count({
            facebookId: profile.id
        });
        if (isExists) {
            let user = await Client.findOne({
                facebookId: profile.id
            });
            return cb(null, user);
        } else {
            let user = await Client.create({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                facebookId: profile.id,
                email: profile.email || ''
            });
            return cb(null, user);
        }
    } catch (e) {
        cb(e);
    }
});