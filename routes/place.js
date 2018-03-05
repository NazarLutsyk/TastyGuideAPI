const PlaceController = require('../controllers/PlaceController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/Place');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceController.getPlaces)
    .post(PlaceController.createPlace);
router.route('/:id')
    .get(PlaceController.getPlaceById)
    .put(permission(Rules.updatePlace),PlaceController.updatePlace)
    .delete(permission(Rules.updatePlace),PlaceController.removePlace);
router.route('/:id/placeTypes/:idType')
    .put(permission(),PlaceController.addPlaceType)
    .delete(permission(),PlaceController.removePlaceType);
router.route('/:id/promos/:idPromo')
    .put(permission(),PlaceController.addPromo)
    .delete(permission(),PlaceController.removePromo);
router.route('/:id/complaints/:idComplaint')
    .put(permission(),PlaceController.addComplaint)
    .delete(permission(),PlaceController.removeComplaint);
router.route('/:id/drinkApplications/:idApp')
    .put(permission(),PlaceController.addDrinkApp)
    .delete(permission(),PlaceController.removeDrinkApp);
router.route('/:id/ratings/:idRating')
    .put(permission(),PlaceController.addRating)
    .delete(permission(),PlaceController.removeRating);
router.route('/:id/departments/:idDepartment')
    .put(permission(),PlaceController.addDepartment)
    .delete(permission(),PlaceController.removeDepartment);
router.route('/:id/multilangs/:idMultilang')
    .put(permission(),PlaceController.addMultilang)
    .delete(permission(),PlaceController.removeMultilang);
router.route('/:id/days/:idDay')
    .put(permission(),PlaceController.addDay)
    .delete(permission(),PlaceController.removeDay);
router.route('/:id/hashTags/:idHashTag')
    .put(permission(),PlaceController.addHashTag)
    .delete(permission(),PlaceController.removeHashTag);
router.route('/:id/tops/:idTop')
    .put(permission(),PlaceController.addTop)
    .delete(permission(),PlaceController.removeTop);

module.exports = router;
