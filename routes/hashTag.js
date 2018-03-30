const HashTagController = require('../controllers/HashTagController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(HashTagController.getHashTags)
    .post(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        HashTagController.createHashTag
    );
router.route('/:id')
    .get(HashTagController.getHashTagById)
    .put(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        HashTagController.updateHashTag
    )
    .delete(
        permission.roles(ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        HashTagController.removeHashTag
    );
module.exports = router;
