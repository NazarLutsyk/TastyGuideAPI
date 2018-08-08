const express = require("express");
const router = express.Router();
const passportMiddleware = require("../middleware/passport");

let query = require("../middleware/query");
router.use(query.parseQuery);

router.use((req, res, next) => {
    res.locals.doCheck = ["post", "put", "delete"].indexOf(req.method.toLowerCase()) >= 0;
    next();
});

router.use(passportMiddleware.isLoggedIn);

router.use("/places", require("./place"));
router.use("/clients", require("./client"));
router.use("/langs", require("./lang"));
router.use("/placeTypes", require("./placeType"));
router.use("/topPlaces", require("./topPlace"));
router.use("/departments", require("./department"));
router.use("/ratings", require("./rating"));
router.use("/drinkApplications", require("./drinkApplication"));
router.use("/complaints", require("./complaint"));
router.use("/news", require("./news"));
router.use("/bonuses", require("./bonuse"));
router.use("/events", require("./event"));
router.use("/placeMultilangs", require("./placeMultilang"));
router.use("/placeTypeMultilangs", require("./placeTypeMultilang"));
router.use("/newsMultilangs", require("./newsMultilang"));
router.use("/bonuseMultilangs", require("./bonuseMultilang"));
router.use("/eventMultilangs", require("./eventMultilang"));
router.use("/drinkApplicationComments", require("./drinkApplicationComment"));
router.use("/reviews", require("./reviews"));
router.use("/topCategories", require("./topCategories"));
router.use("/topCategoryMultilangs", require("./topCategoryMultilangs"));
router.use("/kitchens", require("./kitchen"));
router.use("/kitchenMultilangs", require("./kitchenMultilang"));
router.use("/cities", require("./city"));
router.use("/cityMultilangs", require("./cityMultilang"));
router.use("/promos", require("./promo"));

module.exports = router;
