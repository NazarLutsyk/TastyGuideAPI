let Department = require(global.paths.MODELS + '/Department');
let relationHelper = require(global.paths.HELPERS + '/relationHelper');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
                let department = await Department.create(req.body);
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
                let updated = await Department.findByIdAndUpdate(departmentId, req.body,{runValidators: true,context:'query'});
                if(updated) {
                    res.status(201).json(await Department.findById(departmentId));
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
    async addPromo(req, res) {
        let modelId = req.params.id;
        let promoId = req.params.idPromo;
        try {
            if (modelId && promoId) {
                await relationHelper.addRelation
                ('Department', 'Promo', modelId, promoId, 'promos', 'author');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePromo(req, res) {
        let modelId = req.params.id;
        let promoId = req.params.idPromo;
        try {
            if (modelId && promoId) {
                await relationHelper.removeRelation
                ('Department', 'Promo', modelId, promoId, 'promos', 'author');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};