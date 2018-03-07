let Complaint = require(global.paths.MODELS + '/Complaint');

module.exports = {
    async getComplaints(req, res) {
        try {
            let complaintQuery = Complaint
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    complaintQuery.populate(populateField);
                }
            }
            let complaints = await complaintQuery.exec();
            res.json(complaints);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getComplaintById(req, res) {
        let complaintId = req.params.id;
        try {
            let complaintQuery = Complaint.find({_id: complaintId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    complaintQuery.populate(populateField);
                }
            }
            let complaint = await complaintQuery.exec();
            res.json(complaint);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createComplaint(req, res) {
        try {
            let complaint = await Complaint.create(req.body);
            res.status(201).json(complaint);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateComplaint(req, res) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findByIdAndUpdate(complaintId, req.body,{new : true});
            res.status(201).json(complaint);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeComplaint(req, res) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findById(complaintId);
            complaint = await complaint.remove();
            res.status(204).json(complaint);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};