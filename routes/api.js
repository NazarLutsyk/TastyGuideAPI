const PlaceRouter = require('./place');
const ClientRouter = require('./client');
const LangRouter = require('./lang');
const PlaceTypeRouter = require('./placeType');
const TopPlaceRouter = require('./topPlace');
const HashTagRouter = require('./hashTag');
const DepartmentRouter = require('./department');
const RatingRouter = require('./rating');
const DrinkApplicationRouter = require('./drinkApplication');
const CurrencyRouter = require('./currency');
const ComplaintRouter = require('./complaint');
const DayRouter = require('./day');
const NewsRouter = require('./news');
const BonuseRouter = require('./bonuse');
const EventRouter = require('./event');
const PlaceMultilangRouter = require('./placeMultilang');
const PlaceTypeMultilangRouter = require('./placeTypeMultilang');
const NewsMultilangRouter = require('./newsMultilang');
const BonuseMultilangRouter = require('./bonuseMultilang');
const EventMultilangRouter = require('./eventMultilang');
const LocationRouter = require('./location');
const RelationRouter = require('./relation');
const MessageRouter = require('./message');
const ImageRouter = require('./image');
let query = require('../middleware/query');

const express = require('express');
const router = express.Router();

router.use(query.parseQuery);

router.use('/places', PlaceRouter);
router.use('/clients', ClientRouter);
router.use('/langs', LangRouter);
router.use('/placeTypes', PlaceTypeRouter);
router.use('/topPlaces', TopPlaceRouter);
router.use('/hashTags', HashTagRouter);
router.use('/departments', DepartmentRouter);
router.use('/ratings', RatingRouter);
router.use('/drinkApplications', DrinkApplicationRouter);
router.use('/currencies', CurrencyRouter);
router.use('/complaints', ComplaintRouter);
router.use('/days', DayRouter);
router.use('/news', NewsRouter);
router.use('/bonuses', BonuseRouter);
router.use('/events', EventRouter);
router.use('/placeMultilangs', PlaceMultilangRouter);
router.use('/placeTypeMultilangs', PlaceTypeMultilangRouter);
router.use('/newsMultilangs', NewsMultilangRouter);
router.use('/bonuseMultilangs', BonuseMultilangRouter);
router.use('/eventMultilangs', EventMultilangRouter);
router.use('/locations', LocationRouter);
router.use('/relations', RelationRouter);
router.use('/messages', MessageRouter);
router.use('/images', ImageRouter);

module.exports = router;
