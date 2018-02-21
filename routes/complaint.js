const ComplaintController = require('../controllers/ComplaintController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(ComplaintController.getComplaints)
    .post(ComplaintController.createComplaint);
router.route('/:id')
    .get(ComplaintController.getComplaintById)
    .put(ComplaintController.updateComplaint)
    .delete(ComplaintController.removeComplaint);

module.exports = router;
