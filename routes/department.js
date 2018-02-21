const DepartmentController = require('../controllers/DepartmentController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(DepartmentController.getDepartments)
    .post(DepartmentController.createDepartment);
router.route('/:id')
    .get(DepartmentController.getDepartmentById)
    .put(DepartmentController.updateDepartment)
    .delete(DepartmentController.removeDepartment);

module.exports = router;
