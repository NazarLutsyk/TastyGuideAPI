const PlaceController = require("../controllers/PlaceController");
let permission = require("../middleware/authorizarion/index");
let ROLES = require("../config/roles");
let PlaceRule = require("../middleware/authorizarion/rules/Place");
let GlobalRule = require("../middleware/authorizarion/rules/Global");
let Place = require("../models/Place");
const express = require("express");

const router = express.Router();

router.get('/statistic', permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE), PlaceController.getStatistic);

router.route("/")
    .get(PlaceController.getPlaces)
    .post(
        permission.rule(GlobalRule.updatable(Place.notUpdatable()), ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceController.createPlace
    );
router.route("/:id")
    .get(PlaceController.getPlaceById)
    .put(
        permission.rule(GlobalRule.updatable(Place.notUpdatable()), ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        permission.rule(PlaceRule.updatePlace, ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceController.updatePlace
    )
    .delete(
        permission.rule(PlaceRule.deletePlace, ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        PlaceController.removePlace
    );
router.put("/:id/upload",
    permission.rule(PlaceRule.updatePlace, ROLES.GLOBAL_ROLES.ADMIN_ROLE),
    PlaceController.upload
);

module.exports = router;
