let LocalStrategy = require('passport-local');
let Client = require(global.paths.MODELS + '/Client');

exports.LocalSignup = new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    }, async function (req, login, password, done) {
        try {
            if (await Client.count({login: login})) {
                return done(null, false, {message: 'Login is already in use.'});
            } else {
                for (let key of Object.keys(req.body)) {
                    if (Client.notUpdatable().indexOf(key) !== -1) {
                        return done(null, false,{message:'Not updatable fields'});
                    }
                }
                let client = new Client(req.body);
                client.password = client.encryptPassword(client.password);
                client = await client.save();
                return done(null, client);
            }
        } catch (e) {
            return done(e);
        }
    }
);
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