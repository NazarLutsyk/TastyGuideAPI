const ComplaintController = require(global.paths.CONTROLLERS + '/ComplaintController');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Complaint');

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
