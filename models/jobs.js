const mongoose = require('mongoose');
const validator = require('validator');
const slugify  = require('slugify');
const geoCoder = require('../utils/geocoder')
const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,'Please enter Job title'],
        trim:true,
        maxlength:[100,'Job title cannot be longer than 100 characters!']
    },
    slug : String, //slugify links- blog post title is “Everything You Need to Know About Content Marketing”, your slug could be “everything-about-content-marketing”
    description: {
        type: String,
        required : [true,'Please enter the job description.'],
        maxlength : [1000, 'Job description cannot exceed 100 characters!']
    },
    email:{
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email address!']
    },
    address:{
        type: String,
        required: [true, 'Please add an address.']
    },
    location:{
        type: {
            type:String,
            enum:['Point']
        },
        coordinates:{
            type:[Number],
            index:'2dSphere'
        },
        formattedAddress: String,
        city: String,
        state:String,
        zipcode:String,
        country:String
    },
    company : {
        type: String,
        required : [true, 'Please add company name!']
    },
    industry:{
        type:[String], //could be related to multiple industries
        required: [true , 'Please enter valid industry type for the job!'],
        enum : {
            values:[
                'IT',
                'Finance',
                'Education',
                'Healthcare',
                'Other'
            ],
            message: 'Please select valid industry!'
        }
    },
    jobType:{
        type: String,
        required: [true, 'Please enter valid job type!'],
        enum:{
            values:[
                'Full-time',
                'Part-time',
                'Internship'
            ],
            message:'Please select a valid job type!'
        }
    },
    minEducation:{
        type:  String,
        required: [true, 'Please enter minimum education requirement for the job!'],
        enum:{
            values:[
                'Bachelors',
                'Masters',
                'PhD'
            ],
            message:'Please select a valid education level!'
        }
    },
    positions:{
        type: Number,
        default: 1
    },
    experience:{
        type : String,
        required: [true,'Please enter the required exp level'],
        enum:{
            values:[
                '0-1 year',
                '1-3 years',
                '3-5 years',
                '5 years +'
            ],
            message:'Please enter a valid level of experience!'
        }
    },
    salary:{
        type:Number,
        required: [true,'Please enter the yearly compensation for this job!']
    },
    postingDate:{
        type:Date,
        default:Date.now
    },
    lastDate:{
        type:Date,
        default:new Date().setDate(new Date().getDate()+7)
    },
    applicantsApplied:{
        type:[Object],
        select:false
    }

});

//creating job slug before saving
jobSchema.pre('save',function(next){
    //creating slug before saving to db
    this.slug = slugify(this.title,{lower:true});
    next();
});

//setting up location
jobSchema.pre('save',async function(next){
    const loc = await geoCoder.geocode(this.address);
    
    this.location = {
        type:'Point',
        
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city:loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country:loc[0].countryCode
   }
});

module.exports = mongoose.model('Job', jobSchema);