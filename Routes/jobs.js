const express = require('express')
const router = express.Router()

//Importing jobs controller methods
const {
    getJobs, 
    newJob
} = require('../Controllers/jobsController.js')

router.route('/jobs').get(getJobs);

router.route('/job/new').post(newJob);
module.exports = router