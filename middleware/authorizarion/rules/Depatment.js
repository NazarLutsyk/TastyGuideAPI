let Place = require(global.paths.MODELS + '/Place');
let Department = require(global.paths.MODELS + '/Department');
module.exports = {
    async updateDepartment(req, res, next) {
        let user = req.user;
        let departmentId = req.params.id;
        if (user) {
            let department = await Department.findById(departmentId);
            let place = await Place.findById(department.place);
            if (place.boss.equals(user._id)) {
                next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
};