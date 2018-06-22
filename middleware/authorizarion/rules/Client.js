let Client = require("../../../models/Client");

module.exports = {
    async updateClient(req, res, next) {
        try {
            log("rule update Client");
            let user = req.user;
            let clientId = req.params.id;
            let emailOnUse = 1;

            if (req.body.email){
                emailOnUse += await Client.count({_id: {$ne: clientId}, email: req.body.email});
            }
            if (user._id.equals(clientId) && !req.body.roles && emailOnUse === 1) {
                return next();
            } else {
                let error = new Error();
                error.message = "Forbidden";
                error.status = 403;
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};