let Department = require('../../../models/Department');
let Image = require('../../../models/Image');
let Place = require('../../../models/Place');
module.exports = {
    async updateImage(req,res,next) {
        let user = req.user;
        let imageId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let image = await Image.findById(imageId);
            let places = await Place.find({images : image});
            let allowed = await Department.count({
                place: places,
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