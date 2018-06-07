let passport = require('passport');
let LocalStrategy = require('./LocalStrategy');
let GoogleNativeStrategy = require('./GoogleNativeStrategy');
let FacebookNativeStrategy = require('./FacebookNativeStrategy');
let Client = require('../../models/Client');

passport.serializeUser(function (user, done) {
    log('serialize user');
    done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
    try {
        let client = await Client.findById(id);
        log('deserialize user');
        return done(null, client);
    } catch (e) {
        return done(e);
    }
});

passport.use('local.signup',LocalStrategy.LocalSignup);
passport.use('local.signin',LocalStrategy.LocalSignin);
passport.use(GoogleNativeStrategy.Auth);
passport.use(FacebookNativeStrategy.Auth);