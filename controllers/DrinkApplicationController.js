let DrinkApplication = require('../models/DrinkApplication');

module.exports = {
    async getDrinkApplications(req, res) {
        try {
            let drinkApplications = await DrinkApplication.find({});
            res.json(drinkApplications);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getDrinkApplicationById(req, res) {
        let drinkApplicationId = req.params.id;
        try {
            let drinkApplication = await DrinkApplication.findById(drinkApplicationId);
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