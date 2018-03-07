const express = require('express');
const router = express.Router();

let query = require(global.paths.MIDDLEWARE + '/query');
router.use(query.parseQuery);

router.use('/places', require('./place'));
router.use('/clients', require('./client'));
router.use('/langs', require('./lang'));
router.use('/placeTypes', require('./placeType'));
router.use('/topPlaces', require('./topPlace'));
router.use('/hashTags', require('./hashTag'));
router.use('/departments', require('./department'));
router.use('/ratings', require('./rating'));
router.use('/drinkApplications', require('./drinkApplication'));
router.use('/currencies', require('./currency'));
router.use('/complaints', require('./complaint'));
router.use('/days', require('./day'));
router.use('/news', require('./news'));
router.use('/bonuses', require('./bonuse'));
router.use('/events', require('./event'));
router.use('/placeMultilangs', require('./placeMultilang'));
router.use('/placeTypeMultilangs', require('./placeTypeMultilang'));
router.use('/newsMultilangs', require('./newsMultilang'));
router.use('/bonuseMultilangs', require('./bonuseMultilang'));
router.use('/eventMultilangs', require('./eventMultilang'));
router.use('/locations', require('./location'));
router.use('/messages', require('./message'));
router.use('/images', require('./image'));

module.exports = router;
