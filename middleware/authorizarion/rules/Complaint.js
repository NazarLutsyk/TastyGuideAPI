let Client = require(global.paths.MODELS + '/Client');
let Complaint = require(global.paths.MODELS + '/Complaint');
module.exports = {
    async deleteMessage(req, res, next) {
        let user = req.user;
        let complaintId = req.params.id;
        if (user) {
            let allowed = await Complaint.count({_id : complaintId, client : user._id});
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