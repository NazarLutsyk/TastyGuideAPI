let router = require('express').Router();
let passport = require('passport');
let PassportMiddleware = require(global.paths.MIDDLEWARE + '/passport');
let UserController = require(global.paths.CONTROLLERS + '/UserController');

router.post('/local/signup', PassportMiddleware.notLoggedIn, UserController.signUp);
router.post('/local/signin', PassportMiddleware.notLoggedIn, UserController.signIn);
router.get('/logout', PassportMiddleware.isLoggedIn, UserController.logout);

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
    PassportMiddleware.notLoggedIn,
    passport.authenticate('facebook'),
    UserController.facebookAuth);

router.get('/google', passport.authenticate('google', {
    scope:
        ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
}));
router.get('/google/callback',
    PassportMiddleware.notLoggedIn,
    passport.authenticate('google'),
    UserController.googleAuth);


router.get('/principal', function (req, res) {
    res.json({
        user: req.user
    });
});

module.exports = router;
