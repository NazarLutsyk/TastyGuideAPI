const DepartmentController = require(global.paths.CONTROLLERS + '/DepartmentController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Depatment');

const router = express.Router();

router.route('/')
    .get(DepartmentController.getDepartments)
    .post(permission(Rule.createDepartment),DepartmentController.createDepartment);
router.route('/:id')
    .get(DepartmentController.getDepartmentById)
    .put(permission(Rule.updateDepartment),DepartmentController.updateDepartment)
    .delete(permission(Rule.updateDepartment),DepartmentController.removeDepartment);
module.exports = router;
