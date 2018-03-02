const ComplaintController = require('../controllers/ComplaintController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Complaint');

const router = express.Router();

router.route('/')
    .get(ComplaintController.getComplaints)
    .post(ComplaintController.createComplaint);
router.route('/:id')
    .get(ComplaintController.getComplaintById)
    .put(permission(Rule.deleteMessage),ComplaintController.deleteMessage)
    .delete(permission(Rule.deleteMessage),ComplaintController.removeComplaint);

module.exports = router;
