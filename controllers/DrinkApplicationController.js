let DrinkApplication = require('../models/DrinkApplication');
let keysValidator = require('../validators/keysValidator');
let mongoose = require("mongoose");

module.exports = {
    async getDrinkApplications(req, res,next) {
        try {
            if (JSON.stringify(req.query).search(/^[0-9a-fA-F]{24}$/)) {
                console.log('here');
                function iterate(obj, stack) {
                    for (let property in obj) {
                        if (obj.hasOwnProperty(property)) {
                            if (typeof obj[property] === "object") {
                                iterate(obj[property], stack + "." + property);
                            } else if (typeof obj[property] === "string" && obj[property].match(/^[0-9a-fA-F]{24}$/)) {
                                obj[property] = mongoose.Types.ObjectId(obj[property]);
                            }
                        }
                    }
                }

                iterate(req.query, "");
            }
            res.json(await DrinkApplication.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getDrinkApplicationById(req, res,next) {
        let drinkApplicationId = req.params.id;
        try {
            req.query.query._id = drinkApplicationId;
            let drinkApp = await DrinkApplication.superfind(req.query);
            res.json(drinkApp[0]);
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