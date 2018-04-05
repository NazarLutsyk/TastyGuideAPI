let Complaint = require("../models/Complaint");
let keysValidator = require("../validators/keysValidator");

module.exports = {
    async getComplaints(req, res, next) {
        try {
            res.json(await Complaint.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getComplaintById(req, res, next) {
        let complaintId = req.params.id;
        try {
            req.query.target.query._id = complaintId;
            res.json(await Complaint.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createComplaint(req, res, next) {
        try {
            let err = keysValidator.diff(Complaint.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
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
    async updateComplaint(req, res, next) {
        let complaintId = req.params.id;
        try {
            let err = keysValidator.diff(Complaint.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let complaint = await Complaint.findById(complaintId);
                if (complaint) {
                    let updated = await complaint.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    let e = new Error();
                    e.status = 404;
                    e.message = "Not found";
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeComplaint(req, res, next) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findById(complaintId);
            if (complaint) {
                complaint = await complaint.remove();
                res.status(204).json(complaint);
            } else {
                let e = new Error();
                e.message = "Not found";
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};