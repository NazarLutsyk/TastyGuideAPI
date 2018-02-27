let router = require('express').Router();
let passport = require('passport');
let PassportMiddleware = require('../middleware/passport');
let UserController = require('../controllers/UserController');

router.post('/signup', PassportMiddleware.notLoggedIn, UserController.signUp);
router.post('/signin', PassportMiddleware.notLoggedIn, UserController.signIn);
router.post('/logout', PassportMiddleware.isLoggedIn, UserController.logout);
router.post('/index', function (req, res) {
    res.json({
        user: req.user
    });
});

module.exports = router;
