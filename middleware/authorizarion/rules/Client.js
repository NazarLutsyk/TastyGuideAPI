module.exports = {
    async updateClient(req, res, next) {
        let user = req.user;
        let clientId = req.params.id;
        if (user) {
            if (user._id.equals(clientId)) {
                next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
};