const DepartmentController = require('../controllers/DepartmentController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Depatment');

const router = express.Router();

router.route('/')
    .get(DepartmentController.getDepartments)
    .post(
        permission.rule(Rule.createDepartment,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DepartmentController.createDepartment
    );
router.route('/:id')
    .get(DepartmentController.getDepartmentById)
    .put(
        permission.rule(Rule.updateDepartment,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DepartmentController.updateDepartment
    )
    .delete(
        permission.rule(Rule.updateDepartment,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DepartmentController.removeDepartment
    );
module.exports = router;
