const BonuseMultilangController = require('../controllers/BonuseMultilangController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(BonuseMultilangController.getBonuseMultilangs)
    .post(BonuseMultilangController.createBonuseMultilang);
router.route('/:id')
    .get(BonuseMultilangController.getBonuseMultilangById)
    .put(BonuseMultilangController.updateBonuseMultilang)
    .delete(BonuseMultilangController.removeImage);

module.exports = router;
