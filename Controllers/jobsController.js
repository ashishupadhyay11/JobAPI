const Job = require('../models/jobs');
const geoCoder = require('../utils/geocoder');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
//Get alljobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors(async (req,res,next) =>{

    const jobs = await Job.find();

    res.status(200).json({
        success : true,
        results:jobs.length,
        data:jobs
    })
});

//create a new job => /api/v1/job/new
exports.newJob=catchAsyncErrors ( async(req,res,next)=>{
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job Created!',
        data: job
    });
});

//get a single job with ID and slug => /api/v1/job/:id/:slug
exports.getJob = catchAsyncErrors(async (req,res,next) =>{
    const job = await Job.find({$and:[{_id:req.params.id},{slug:req.params.slug}]});

    if(!job || job.length===0){
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        })
    }
    res.status(200).json({
        success: true,
        data: job
    });
});

//Update a job => /api/v1/job/:id
exports.updateJob = catchAsyncErrors(async (req, res,next) =>{
    let job = await Job.findById(req.params.id);

    if(!job){
        return next(new ErrorHandler('Job not found', 404));
    }

    job = await Job.findByIdAndUpdate(req.params.id,req.body,{
       new:true,
       runValidators:true,
    });

    res.status(200).json({
        success:true,
        message:'Job is updated',
        data:job
    });
});

//Delete a job => /api/v1/job/:id
exports.deleteJob = catchAsyncErrors(async (req,res,next) =>{
    let job = await Job.findById(req.params.id);

    if(!job){
        return res.status(404).json({
            success: false,
            message:'Job not found'
        })
    }

    job = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message:'Job successfully deleted!'
    });
});

//search jobs within radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = catchAsyncErrors(async (req,res,next) => {
    const {zipcode, distance} = req.params;
    //getting latitude & longitude from geocoder with zipcode
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963; //divide ditance by radius of earth 

    const jobs = await Job.find({
        location: {$geoWithin: {$centerSphere:[[longitude,latitude],radius]
        }}
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data:jobs
    });
});

//get stats about a topic(job) => /api/v1/stats/:topic
exports.jobStats = catchAsyncErrors(async (req,res,next)=>{
    const stats = await Job.aggregate([
        {
            $match :{$text:{$search:"\""+req.params.topic+"\""}}  //created index through shell for text
        },
        {
            $group:{
                _id: {$toUpper:'$experience'}, //makes groups of stats according to ID
                totalJobs : {$sum:1},
                avgPositions : {$avg : '$positions'},
                avgSalary:{$avg:'$salary'},
                minSalary:{$min:'$salary'},
                maxSalary:{$max:'$salary'}
            }
        }
    ]);
    if(stats.length==0){
        return res.status(200).json({
            success: false,
            message: `No stats found for ${req.params.topic}`
        })
    }

    res.status(200).json({
        success: true,
        data: stats
    })
});
