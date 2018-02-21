let Complaint = require('../models/Complaint');

module.exports = {
    async getComplaints(req, res) {
        try {
            let complaints = await Complaint.find({});
            res.json(complaints);
        } catch (e) {
            res.json(e);
        }
    },
    async getComplaintById(req, res) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findById(complaintId);
            res.json(complaint);
        } catch (e) {
            res.json(e);
        }
    },
    async createComplaint(req, res) {
        try {
            let complaint = await Complaint.create(req.body);
            res.json(complaint);
        } catch (e) {
            res.json(e);
        }
    },
    async updateComplaint(req, res) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findByIdAndUpdate(complaintId, req.body,{new : true});
            res.json(complaint);
        } catch (e) {
            res.json(e);
        }
    },
    async removeComplaint(req, res) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findById(complaintId);
            complaint = await complaint.remove();
            res.json(complaint);
        } catch (e) {
            res.json(e);
        }
    }
};