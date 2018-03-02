let Department = require('../../../models/Department');
let Day = require('../../../models/Day');
module.exports = {
    async updateDay(req,res,next) {
        let user = req.user;
        let dayId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let day = await Day.findById(dayId);
            let allowed = await Department.count({
                place: day.place,
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