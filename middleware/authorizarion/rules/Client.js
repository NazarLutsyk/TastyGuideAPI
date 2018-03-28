let Client = require(global.paths.MODELS + '/Client');
module.exports = {
    async updateClient(req, res, next) {
        try {
            let user = req.user;
            let clientId = req.params.id;
            if (user._id.equals(clientId) && !req.body.roles) {
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
    async updatable(req,res,next){
        try {
            for (let key of Object.keys(req.body)) {
                if (Client.notUpdatable().indexOf(key) !== -1) {
                    return res.sendStatus(403);
                }
            }
            return next();
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
};