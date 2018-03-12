let Complaint = require(global.paths.MODELS + '/Complaint');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
            res.status(400).send(e.toString());
        }
    },
    async getComplaintById(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async createComplaint(req, res) {
        try {
            let err = keysValidator.diff(Complaint.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let complaint = await Complaint.create(req.body);
                res.status(201).json(complaint);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateComplaint(req, res) {
        let complaintId = req.params.id;
        try {
            let err = keysValidator.diff(Complaint.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let updated = await Complaint.findByIdAndUpdate(complaintId, req.body, {runValidators: true,context:'query'});
                if (updated) {
                    res.status(201).json(await Complaint.findById(complaintId));
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeComplaint(req, res) {
        let complaintId = req.params.id;
        try {
            let complaint = await Complaint.findById(complaintId);
            if (complaint) {
                complaint = await complaint.remove();
                res.status(204).json(complaint);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};