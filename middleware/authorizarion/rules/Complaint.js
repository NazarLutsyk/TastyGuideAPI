let Complaint = require('../../../models/Complaint');
module.exports = {
    async updateComplaint(req, res, next) {
        try {
            let user = req.user;
            let complaintId = req.params.id;
            let complaint = await Complaint.findById(complaintId);
            if (complaint && complaint.client.equals(user._id)) {
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