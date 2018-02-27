let Department = require('../models/Department');

module.exports = {
    async getDepartments(req, res) {
        try {
            let departmentQuery = Department
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    dayQuery.populate(departmentQuery);
                }
            }
            let departments = await departmentQuery.exec();
            res.json(departments);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getDepartmentById(req, res) {
        let departmentId = req.params.id;
        try {
            let departmentQuery = Department.find({_id: departmentId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    departmentQuery.populate(populateField);
                }
            }
            let department = await departmentQuery.exec();
            res.json(department);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createDepartment(req, res) {
        try {
            let department = await Department.create(req.body);
            res.status(201).json(department);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateDepartment(req, res) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findByIdAndUpdate(departmentId, req.body,{new : true});
            res.status(201).json(department);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDepartment(req, res) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findById(departmentId);
            department = await department.remove();
            res.status(204).json(department);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};