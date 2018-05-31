const DrinkApplicationCommentController = require('../controllers/DrinkApplicationCommentController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/DrinkApplicationComment');

const router = express.Router();

router.route('/')
    .get(DrinkApplicationCommentController.getDrinkApplicationComments)
    .post(DrinkApplicationCommentController.createDrinkApplicationComment);
router.route('/:id')
    .get(DrinkApplicationCommentController.getDrinkApplicationCommentById)
    .delete(
        permission.rule(Rule.deleteMessage,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DrinkApplicationCommentController.removeDrinkApplicationComment
    );

module.exports = router;
