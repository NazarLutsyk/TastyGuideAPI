let DrinkApplication = require('../models/DrinkApplication');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getDrinkApplications(req, res,next) {
        try {
            let drinkApplicationsQuery;
            if (req.query.aggregate) {
                drinkApplicationsQuery = DrinkApplication.aggregate(req.query.aggregate);
            } else {
                drinkApplicationsQuery = DrinkApplication
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        drinkApplicationsQuery.populate(populateField);
                    }
                }
            }
            let drinkApplications = await drinkApplicationsQuery.exec();
            res.json(drinkApplications);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getDrinkApplicationById(req, res,next) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplicationQuery = DrinkApplication.findOne({_id: drinkApplicationId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    drinkApplicationQuery.populate(populateField);
                }
            }
            let drinkApplication = await drinkApplicationQuery.exec();
            res.json(drinkApplication);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createDrinkApplication(req, res,next) {
        try {
            let err = keysValidator.diff(DrinkApplication.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                req.body.organizer = req.user._id;
                let drinkApp = new DrinkApplication(req.body);
                drinkApp = await drinkApp.supersave();
                res.status(201).json(drinkApp);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateDrinkApplication(req, res,next) {
        let drinkApplicationId = req.params.id;
        try {
            let err = keysValidator.diff(DrinkApplication.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let drinkApp = await DrinkApplication.findById(drinkApplicationId);
                if (drinkApp && req.body) {
                    let updated = await drinkApp.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    let e = new Error();
                    e.message = "Not found";
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeDrinkApplication(req, res,next) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplication = await DrinkApplication.findById(drinkApplicationId);
            if (drinkApplication) {
                drinkApplication = await drinkApplication.remove();
                res.status(204).json(drinkApplication);
            } else {
                let e = new Error();
                e.message = "Not found";
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};