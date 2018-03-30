const ComplaintController = require('../controllers/ComplaintController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Complaint');

const router = express.Router();

router.route('/')
    .get(ComplaintController.getComplaints)
    .post(ComplaintController.createComplaint);
router.route('/:id')
    .get(ComplaintController.getComplaintById)
    .put(
        permission.rule(Rule.updateComplaint,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        ComplaintController.updateComplaint
    )
    .delete(
        permission.rule(Rule.updateComplaint,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        ComplaintController.removeComplaint
    );
module.exports = router;
