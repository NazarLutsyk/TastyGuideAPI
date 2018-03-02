const ImageController = require('../controllers/ImageController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Image');

let upload = require('../middleware/multer');

const router = express.Router();

router.route('/')
    .get(ImageController.getImages)
    .post(upload.array('images'),ImageController.createImage);
router.route('/:id')
    .get(ImageController.getImageById)
    .delete(permission(Rule.updateImage),ImageController.removeImage);

module.exports = router;
