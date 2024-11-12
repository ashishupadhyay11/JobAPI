const Job = require('../models/jobs');

//Get alljobs => /api/v1/jobs
exports.getJobs = (req,res,next) =>{
    res.status(200).json({
        success : true,
        requestMethod: req.requestMethod,
        message : "This route will display all jobs in the future"
    })
}

//create a new job => /api/v1/job/new
exports.newJob=async(req,res,next)=>{
    console.log(req.body);
    
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job Created!',
        data: job
    });
}