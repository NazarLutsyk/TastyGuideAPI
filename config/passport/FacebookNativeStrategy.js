let Client = require("../../models/Client");
var FacebookTokenStrategy = require("passport-facebook-token");

module.exports.Auth = new FacebookTokenStrategy({
    clientID: '387568105079528',
    clientSecret: 'e946faaa954c2ed74167d9d0ea4e8383'
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
            log('create client');
            return cb(null, user);
        }
    } catch (e) {
        cb(e);
    }
});