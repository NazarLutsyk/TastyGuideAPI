let Message = require(global.paths.MODELS + '/Message');
module.exports = {
    async deleteMessage(req, res, next) {
        try {
            let user = req.user;
            let messageId = req.params.id;
            let message = await Message.findById(messageId);
            if (message.sender.equals(user._id)) {
                return next();
            } else {
                return res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};