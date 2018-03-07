let Message = require(global.paths.MODELS + '/Message');

module.exports = {
    async getMessages(req, res) {
        try {
            let messages = await Message.find({});
            res.json(messages);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getMessageById(req, res) {
        let messageId = req.params.id;
        try {
            let message = await Message.findById(messageId);
            res.json(message);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createMessage(req, res) {
        try {
            let message = await Message.create(req.body);
            res.status(201).json(message);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeMessage(req, res) {
        let messageId = req.params.id;
        try {
            let message = await Message.findByIdAndRemove(messageId);
            res.status(204).json(message);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};