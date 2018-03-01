let FacebookStrategy = require('passport-facebook').Strategy;
let Client = require('../../models/Client');
let config = require('../config');

exports.Auth = new FacebookStrategy({
    clientID: config.FACEBOOK.CLIENT_ID,
    clientSecret: config.FACEBOOK.CLIENT_SECRET,
    callbackURL: config.FACEBOOK.CALLBACK_URL,
    profileFields: ['id', 'name', 'email','photos']
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        let isExists = await Client.count({
            facebookId: profile.id
        });
        if (isExists) {
            let user = await Client.findOne({
                facebookId: profile.id
            });
            user.name = profile.name.givenName;
            user.surname = profile.name.familyName;
            user.email = profile.email || '';
            user.avatar = profile._json.picture.data.url;
            user = await user.save();
            return cb(null, user);
        } else {
            let user = await Client.create({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                facebookId: profile.id,
                email: profile.email || '',
                avatar : profile._json.picture.data.url
            });
            return cb(null, user);
        }
    } catch (e) {
        cb(e);
    }
});