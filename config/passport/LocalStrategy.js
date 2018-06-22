let LocalStrategy = require('passport-local');
let Client = require('../../models/Client');

exports.LocalSignin = new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, async function (req, login, password, done) {
    try {
        let client = await Client.findOne({login: login});
        if (client) {
            if (client.validPassword(password)) {
                done(null, client);
            } else {
                done(null, false);
            }
        } else {
            return done(null, false);
        }
    } catch (e) {
        return done(e);
    }
});