let DrinkApplicationComment = require("../models/DrinkApplicationComment");
let keysValidator = require("../validators/keysValidator");

module.exports = {
    async getDrinkApplicationComments(req, res, next) {
        try {
            res.json(await DrinkApplicationComment.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getDrinkApplicationCommentById(req, res, next) {
        let messageId = req.params.id;
        try {
            req.query.query._id = messageId;
            let message = await DrinkApplicationComment.superfind(req.query);
            res.json(message[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createDrinkApplicationComment(req, res, next) {
        try {
            let err = keysValidator.diff(DrinkApplicationComment.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                req.body.sender = req.user._id;
                let message = new DrinkApplicationComment(req.body);
                message = await message.supersave();
                res.status(201).json(message);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeDrinkApplicationComment(req, res, next) {
        let messageId = req.params.id;
        try {
            let message = await DrinkApplicationComment.findById(messageId);
            if (message) {
                await message.remove();
                res.status(204).json(message);
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