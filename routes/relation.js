const RelationController = require('../controllers/RelationController');
const express = require('express');

const router = express.Router();

router.route('/:model1/:id1/:model2/:id2')
    .post(RelationController.addRelation)
    .delete(RelationController.removeRelation);

module.exports = router;
