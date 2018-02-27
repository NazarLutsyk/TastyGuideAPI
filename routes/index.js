const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.end('Drinker API');
});

module.exports = router;
