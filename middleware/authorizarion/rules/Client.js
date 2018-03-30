module.exports = {
    async updateClient(req, res, next) {
        try {
            log('rule update Client');
            let user = req.user;
            let clientId = req.params.id;
            if (user._id.equals(clientId) && !req.body.roles) {
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