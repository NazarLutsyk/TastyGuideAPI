let Complaint = require('../models/Complaint');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getComplaints(req, res,next) {
        try {
            let complaintQuery;
            if (req.query.aggregate) {
                complaintQuery = Complaint.aggregate(req.query.aggregate);
            } else {
                complaintQuery = Complaint
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        complaintQuery.populate(populateField);
                    }
                }
            }
            let complaints = await complaintQuery.exec();
            res.json(complaints);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getComplaintById(req, res,next) {
        let complaintId = req.params.id;
        try {
            let complaintQuery = Complaint.findOne({_id: complaintId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    complaintQuery.populate(populateField);
                }
            }
            let complaint = await complaintQuery.exec();
            res.json(complaint);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createComplaint(req, res,next) {
        try {
            let err = keysValidator.diff(Complaint.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                req.body.client = req.user._id;
                let complaint = new Complaint(req.body);
                complaint = await complaint.supersave();
                res.status(201).json(complaint);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateComplaint(req, res,next) {
        let complaintId = req.params.id;
        try {
            let err = keysValidator.diff(Complaint.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let complaint = await Complaint.findById(complaintId);
                if (complaint) {
                    let updated = await complaint.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    let e = new Error();
                    e.status = 404;
                    e.message = 'Not found';
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeComplaint(req, res,next) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findById(complaintId);
            if (complaint) {
                complaint = await complaint.remove();
                res.status(204).json(complaint);
            } else {
                let e = new Error();
                e.message = 'Not found';
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};