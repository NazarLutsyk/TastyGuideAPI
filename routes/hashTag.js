const HashTagController = require('../controllers/HashTagController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(HashTagController.getHashTags)
    .post(HashTagController.createHashTag);
router.route('/:id')
    .get(HashTagController.getHashTagById)
    .put(HashTagController.updateHashTag)
    .delete(HashTagController.removeHashTag);

module.exports = router;
