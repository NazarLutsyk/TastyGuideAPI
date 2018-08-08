const TopCategoryController = require("../controllers/TopCategoryController");
let permission = require("../middleware/authorizarion/index");
let ROLES = require("../config/roles");
const express = require("express");

const router = express.Router();

router.route("/")
    .get(TopCategoryController.getTopCategories)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopCategoryController.createTopCategory
    );
router.route("/:id")
    .get(TopCategoryController.getTopCategoryById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopCategoryController.updateTopCategory
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        TopCategoryController.removeTopCategory
    );
module.exports = router;
