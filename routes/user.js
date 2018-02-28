let router = require('express').Router();
let passport = require('passport');
let PassportMiddleware = require('../middleware/passport');
let UserController = require('../controllers/UserController');

router.post('/local/signup', PassportMiddleware.notLoggedIn, UserController.signUp);
router.post('/local/signin', PassportMiddleware.notLoggedIn, UserController.signIn);
router.post('/logout', PassportMiddleware.isLoggedIn, UserController.logout);

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


router.get('/index', function (req, res) {
    //todo delete that
    res.json({
        user: req.user
    });
});

module.exports = router;
