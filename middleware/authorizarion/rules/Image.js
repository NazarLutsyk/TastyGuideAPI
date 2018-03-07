let Department = require(global.paths.MODELS + '/Department');
let Image = require(global.paths.MODELS + '/Image');
let Place = require(global.paths.MODELS + '/Place');
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