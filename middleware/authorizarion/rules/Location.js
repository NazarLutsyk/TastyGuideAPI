let Department = require('../../../models/Department');
let Location = require('../../../models/Location');
module.exports = {
    async updateLocation(req,res,next) {
        let user = req.user;
        let locationId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let location = await Location.findById(locationId);
            let allowed = await Department.count({
                place: location.place,
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