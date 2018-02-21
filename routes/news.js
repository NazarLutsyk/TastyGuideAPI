const NewsController = require('../controllers/NewsController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsController.getNews)
    .post(NewsController.createNews);
router.route('/:id')
    .get(NewsController.getNewsById)
    .put(NewsController.updateNews)
    .delete(NewsController.removeNews);

module.exports = router;
