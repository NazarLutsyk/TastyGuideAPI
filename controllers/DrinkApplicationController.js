let DrinkApplication = require('../models/DrinkApplication');

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
            res.send(e.toString());
        }
    },
    async getDrinkApplicationById(req, res) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplicationQuery = DrinkApplication.find({_id: drinkApplicationId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    drinkApplicationQuery.populate(populateField);
                }
            }
            let drinkApplication = await drinkApplicationQuery.exec();
            res.json(drinkApplication);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createDrinkApplication(req, res) {
        try {
            let drinkApplication = await DrinkApplication.create(req.body);
            res.json(drinkApplication);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateDrinkApplication(req, res) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplication = await DrinkApplication.findByIdAndUpdate(drinkApplicationId, req.body,{new : true});
            res.json(drinkApplication);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeDrinkApplication(req, res) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplication = await DrinkApplication.findById(drinkApplicationId);
            drinkApplication = await drinkApplication.remove();
            res.json(drinkApplication);
        } catch (e) {
            res.send(e.toString());
        }
    }
};