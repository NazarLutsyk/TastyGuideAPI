let Client = require(global.paths.MODELS + '/Client');
module.exports = {
    async updateClient(req, res, next) {
        try {
            let user = req.user;
            let clientId = req.params.id;
            if (user._id.equals(clientId) && !req.body.roles) {
                return next();
            } else {
                return res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};