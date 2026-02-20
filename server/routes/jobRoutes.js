const express = require('express');
const router = express.Router();

const { getAllJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').patch(updateJob).delete(deleteJob);

module.exports = router;