const ComplaintController = require(global.paths.CONTROLLERS + '/ComplaintController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Complaint');

const router = express.Router();

router.route('/')
    .get(ComplaintController.getComplaints)
    .post(ComplaintController.createComplaint);
router.route('/:id')
    .get(ComplaintController.getComplaintById)
    .put(permission(Rule.deleteMessage),ComplaintController.updateComplaint)
    .delete(permission(Rule.deleteMessage),ComplaintController.removeComplaint);

module.exports = router;
