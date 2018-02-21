const BonuseController = require('../controllers/BonuseController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseController.getBonuses)
    .post(BonuseController.createBonuse);
router.route('/:id')
    .get(BonuseController.getBonuseById)
    .put(BonuseController.updateBonuse)
    .delete(BonuseController.removeBonuse);

module.exports = router;
