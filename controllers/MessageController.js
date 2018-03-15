let Message = require(global.paths.MODELS + '/Message');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

module.exports = {
    async getMessages(req, res) {
        try {
            let messageQuery = Message
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    messageQuery.populate(populateField);
                }
            }
            let news = await messageQuery.exec();
            res.json(news);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getMessageById(req, res) {
        let messageId = req.params.id;
        try {
            let messageQuery = Message.findOne({_id: messageId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    messageQuery.populate(populateField);
                }
            }
            let messages = await messageQuery.exec();
            res.json(messages);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createMessage(req, res) {
        try {
            let err = keysValidator.diff(Message.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let message = new Message(req.body);
                message = await message.supersave();
                res.status(201).json(message);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeMessage(req, res) {
        let messageId = req.params.id;
        try {
            let message = await Message.findById(messageId);
            if (message) {
                await message.remove();
                res.status(204).json(message);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};