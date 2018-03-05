const DepartmentController = require('../controllers/DepartmentController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Depatment');

const router = express.Router();

router.route('/')
    .get(DepartmentController.getDepartments)
    .post(permission(Rule.updateDepartment),DepartmentController.createDepartment);
router.route('/:id')
    .get(DepartmentController.getDepartmentById)
    .put(permission(Rule.updateDepartment),DepartmentController.updateDepartment)
    .delete(permission(Rule.updateDepartment),DepartmentController.removeDepartment);
router.route('/:id/promos/:idPromo')
    .put(permission(),DepartmentController.addPromo)
    .delete(permission(),DepartmentController.removePromo);

module.exports = router;
