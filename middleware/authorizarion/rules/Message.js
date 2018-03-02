let Message = require('../../../models/Message');
module.exports = {
    async deleteMessage(req, res, next) {
        let user = req.user;
        let messageId = req.params.id;
        if (user) {
            let message = await Message.findById(messageId);
            if (message.sender.equals(user._id)) {
                next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    },
    async getMessage(req, res, next) {
        let user = req.user;
        let messageId = req.params.id;
        if (user) {
            let message = await Message.findById(messageId);
            if (message.sender.equals(user._id) || message.receiver.equals(user._id)) {
                return next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
};