let passport = require('passport');
let LocalStrategy = require('passport-local');
let Client = require('../models/Client');

passport.serializeUser(function (user, done) {
    done(null,user.id);
});
passport.deserializeUser(async function (id, done) {
    try {
        let client = await Client.findById(id);
        return done(null, client);
    } catch (e) {
        return done(e);
    }
});

passport.use('local.signup', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    }, async function (req, login, password, done) {
        try {
            if (await Client.count({login: login})) {
                return done(null, false,{message: 'Login is already in use.'});
            } else {
                let client = new Client(req.body);
                client.password = client.encryptPassword(client.password);
                client = await client.save();
                return done(null, client);
            }
        } catch (e) {
            return done(e);
        }
    }
));

passport.use('local.signin', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    }, async function (req, login, password,done) {
        try {
            let client = await Client.findOne({login: login});
            if (client) {
                if (client.validPassword(password)){
                    done(null,client);
                }else {
                    done(null,false);
                }
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(e);
        }
    })
);