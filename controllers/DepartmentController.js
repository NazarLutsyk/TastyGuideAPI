let Department = require(global.paths.MODELS + '/Department');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

module.exports = {
    async getDepartments(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async getDepartmentById(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async createDepartment(req, res) {
        try {
            let err = keysValidator.diff(Department.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let department = new Department(req.body);
                department = await department.supersave();
                res.status(201).json(department);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateDepartment(req, res) {
        let departmentId = req.params.id;
        try {
            let err = keysValidator.diff(Department.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let department = await Department.findById(departmentId);
                if (department) {
                    let updated = await department.superupdate(req.body);
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDepartment(req, res) {
        let departmentId = req.params.id;
        try {
            let department = await Department.findById(departmentId);
            if (department) {
                department = await department.remove();
                res.status(204).json(department);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};