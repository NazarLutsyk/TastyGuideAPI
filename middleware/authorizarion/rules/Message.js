let Message = require('../../../models/Message');
module.exports = {
    async deleteMessage(req, res, next) {
        try {
            log('rule delete Message');
            let user = req.user;
            let messageId = req.params.id;
            let message = await Message.findById(messageId);
            if (message && message.sender.equals(user._id)) {
                return next();
            } else {
                let error = new Error();
                error.message = 'Forbidden';
                error.status = 403;
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};