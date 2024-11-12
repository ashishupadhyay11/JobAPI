const express = require('express')
const app = express()

const dotenv= require('dotenv')
//Setting up config.env vars

const connectDatabase = require('./Config/database')
dotenv.config({path: './config/config.env'})
connectDatabase();

//Setup body parser
app.use(express.json());
//creating a middleware (present globally)
// const middleware =(req,res,next)=>{
//     console.log('Hello from middleware.')

//     //setting a global variable
//     req.requestMethod = req.url;
//     next();
// }
// app.use(middleware);

//Importing routes
const jobs = require('./Routes/jobs.js')


app.use('/api/v1',jobs)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode!`)
})
