let Message = require("../models/Message");
let keysValidator = require("../validators/keysValidator");

module.exports = {
    async getMessages(req, res, next) {
        try {
            req.query.target.query.$or = [{receiver: req.user._id}, {sender: req.user._id}];
            res.json(await Message.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getMessageById(req, res, next) {
        let messageId = req.params.id;
        try {
            let messageQuery = Message.findOne({
                _id: messageId,
                $or: [{receiver: req.user._id}, {sender: req.user._id}]
            })
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    messageQuery.populate(populateField);
                }
            }
            let messages = await messageQuery.exec();
            res.json(messages);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createMessage(req, res, next) {
        try {
            let err = keysValidator.diff(Message.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                req.body.sender = req.user._id;
                let message = new Message(req.body);
                message = await message.supersave();
                res.status(201).json(message);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeMessage(req, res, next) {
        let messageId = req.params.id;
        try {
            let message = await Message.findById(messageId);
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