const NewsMultilangController = require('../controllers/NewsMultilangController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(NewsMultilangController.getNewsMultilangs)
    .post(NewsMultilangController.createNewsMultilang);
router.route('/:id')
    .get(NewsMultilangController.getNewsMultilangById)
    .put(NewsMultilangController.updateNewsMultilang)
    .delete(NewsMultilangController.removeNewsMultilang);

module.exports = router;
