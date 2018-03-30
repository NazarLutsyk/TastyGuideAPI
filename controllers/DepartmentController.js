let Department = require('../models/Department');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getDepartments(req, res,next) {
        try {
            let departmentQuery;
            if (req.query.aggregate) {
                departmentQuery = Department.aggregate(req.query.aggregate);
            } else {
                departmentQuery = Department
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        departmentQuery.populate(populateField);
                    }
                }
            }
            let departments = await departmentQuery.exec();
            res.json(departments);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getDepartmentById(req, res,next) {
        let departmentId = req.params.id;
        try {
            let departmentQuery = Department.findOne({_id: departmentId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    departmentQuery.populate(populateField);
                }
            }
            let department = await departmentQuery.exec();
            res.json(department);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createDepartment(req, res,next) {
        try {
            let err = keysValidator.diff(Department.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let department = new Department(req.body);
                department = await department.supersave();
                res.status(201).json(department);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateDepartment(req, res,next) {
        let departmentId = req.params.id;
        try {
            let err = keysValidator.diff(Department.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let department = await Department.findById(departmentId);
                if (department) {
                    let updated = await department.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    let e = new Error();
                    e.message = "Not found";
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeDepartment(req, res,next) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findById(departmentId);
            if (department) {
                department = await department.remove();
                res.status(204).json(department);
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
    },
};