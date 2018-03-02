let Department = require('../../../models/Department');
let Promo = require('../../../models/Promo');
module.exports = {
    async updatePromo(req,res,next) {
        let user = req.user;
        let promoId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let promo = await Promo.findById(promoId);
            let allowed = await Department.count({
                place: promo.place,
                client : user.departments
            });
            if (allowed > 0) {
                next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
};