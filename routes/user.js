let router = require("express").Router();
let passport = require("passport");
let PassportMiddleware = require("../middleware/passport");
let UserController = require("../controllers/UserController");
let query = require("../middleware/query");
let Client = require("../models/Client");

router.post("/local/signup", PassportMiddleware.notLoggedIn, UserController.signUp);
router.post("/local/signin", PassportMiddleware.notLoggedIn, UserController.signIn);
router.get("/logout", PassportMiddleware.isLoggedIn, UserController.logout);

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback",
    PassportMiddleware.notLoggedIn,
    passport.authenticate("facebook"),
    UserController.facebookAuth);

router.get("/google", passport.authenticate("google", {
    scope:
        ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));
router.get("/google/callback",
    PassportMiddleware.notLoggedIn,
    passport.authenticate("google"),
    UserController.googleAuth);


router.post('/google-native',passport.authenticate('google-token'), UserController.googleNative);
router.post('/facebook-native',passport.authenticate('facebook-token'), UserController.facebookNative);

router.get("/principal", query.parseQuery, async function (req, res) {
    if (req.user) {
        req.query.query._id = req.user._id;
        let client = await Client.superfind(req.query);
        res.json(client[0]);
    } else {
        res.json(null);
    }
});

module.exports = router;
