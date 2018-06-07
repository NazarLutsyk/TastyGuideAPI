let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let Client = require("../../models/Client");

exports.Auth = new JwtStrategy({
    secretOrKey: 'asddwef684897AD5asd5f82dfAsd',
    jwtFromRequest: ExtractJwt.fromBodyField('payload')
}, async function (payload, done) {
    try {
        let user = payload.user;
        let socialName = payload.socialName;
        let socialProfileId = payload.socialProfileId;

        let exists = 0;
        let ok = false;
        let isGoogle = socialName.toLowerCase() === "google";
        let isFacebook = socialName.toLowerCase() === "facebook";

        if (isFacebook) {
            exists = await Client.count({facebookId: socialProfileId});
            ok = true;
        } else if (isGoogle) {
            exists = await Client.count({googleId: socialProfileId});
            ok = true;
        }

        if (ok) {
            if (exists) {
                let principal = null;
                if (isFacebook) {
                    principal = await Client.findOne({
                        facebookId: socialProfileId
                    });
                } else if (isGoogle) {
                    principal = await Client.findOne({
                        googleId: socialProfileId
                    });
                }
                principal.name = user.name.givenName;
                principal.surname = user.name.familyName;
                principal.email = user.email || "";
                principal.avatar = user.avatar;
                principal = await principal.save();
                return cb(null, principal);
            } else {
                let principal = new Client({
                    name: user.name.givenName,
                    surname: user.name.familyName,
                    email: user.email || "",
                    avatar: user.avatar
                });
                if (isGoogle) {
                    principal.googleId = socialProfileId;
                } else if (isFacebook) {
                    principal.facebookId = socialProfileId;
                }
                log("create client");
                return cb(null, await principal.save());
            }
        } else {
            return done(new Error("Not specified social network"), false);
        }

    } catch (e) {
        return done(e, false);
    }
});