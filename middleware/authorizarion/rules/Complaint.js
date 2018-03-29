let Client = require(global.paths.MODELS + '/Client');
let Complaint = require(global.paths.MODELS + '/Complaint');
module.exports = {
    async updateComplaint(req, res, next) {
        try {
            let user = req.user;
            let complaintId = req.params.id;
            let complaint = await Complaint.findById(complaintId);
            if (complaint && complaint.client.equals(user._id)) {
                return next();
            } else {
                return res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};