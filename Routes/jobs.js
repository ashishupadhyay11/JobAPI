const express = require('express')
const router = express.Router()

//Importing jobs controller methods
const {
    getJobs, 
    newJob,
    getJobsInRadius,
    updateJob,
    deleteJob
} = require('../Controllers/jobsController.js')

router.route('/jobs').get(getJobs);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/job/new').post(newJob);
router.route('/job/:id')
.put(updateJob)
.delete(deleteJob);

module.exports = router