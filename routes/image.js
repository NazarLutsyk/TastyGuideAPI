const ImageController = require(global.paths.CONTROLLERS + '/ImageController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Image');

const router = express.Router();

router.route('/')
    .get(ImageController.getImages)
    .post(ImageController.createImage);
router.route('/:id')
    .get(ImageController.getImageById)
    .delete(permission(Rule.updateImage),ImageController.removeImage);

module.exports = router;
