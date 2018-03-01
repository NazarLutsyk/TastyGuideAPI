const ImageController = require('../controllers/ImageController');
const express = require('express');

let upload = require('../middleware/multer');

const router = express.Router();

router.route('/')
    .get(ImageController.getImages)
    .post(upload.array('images'),ImageController.createImage);
router.route('/:id')
    .get(ImageController.getImageById)
    .delete(ImageController.removeImage);

module.exports = router;
