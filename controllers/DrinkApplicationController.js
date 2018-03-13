let DrinkApplication = require(global.paths.MODELS + '/DrinkApplication');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getDrinkApplications(req, res) {
        try {
            let drinkApplicationsQuery = DrinkApplication
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    drinkApplicationsQuery.populate(populateField);
                }
            }
            let drinkApplications = await drinkApplicationsQuery.exec();
            res.json(drinkApplications);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getDrinkApplicationById(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async createDrinkApplication(req, res) {
        try {
            let err = keysValidator.diff(DrinkApplication.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let drinkApplication = await DrinkApplication.create(req.body);
                res.status(201).json(drinkApplication);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateDrinkApplication(req, res) {
        let drinkApplicationId = req.params.id;
        try {
            let err = keysValidator.diff(DrinkApplication.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let drinkApp = await DrinkApplication.findById(drinkApplicationId);
                if (drinkApp) {
                    objectHelper.load(drinkApp, req.body);
                    let updated = await drinkApp.save();
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDrinkApplication(req, res) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplication = await DrinkApplication.findById(drinkApplicationId);
            if (drinkApplication) {
                drinkApplication = await drinkApplication.remove();
                res.status(204).json(drinkApplication);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};