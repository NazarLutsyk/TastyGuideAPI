let Department = require('../models/Department');

module.exports = {
    async getDepartments(req, res) {
        try {
            let departments = await Department.find({});
            res.json(departments);
        } catch (e) {
            res.json(e);
        }
    },
    async getDepartmentById(req, res) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findById(departmentId);
            res.json(department);
        } catch (e) {
            res.json(e);
        }
    },
    async createDepartment(req, res) {
        try {
            let department = await Department.create(req.body);
            res.json(department);
        } catch (e) {
            res.json(e);
        }
    },
    async updateDepartment(req, res) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findByIdAndUpdate(departmentId, req.body,{new : true});
            res.json(department);
        } catch (e) {
            res.json(e);
        }
    },
    async removeDepartment(req, res) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findById(departmentId);
            department = await department.remove();
            res.json(department);
        } catch (e) {
            res.json(e);
        }
    }
};