const express = require('express');
const app = express();

const dotenv= require('dotenv');
//Setting up config.env vars

const connectDatabase = require('./Config/database');
const errorMiddleware = require('./middlewares/errors.js');
const ErrorHandler = require('./utils/errorHandler.js');

//setting config file vars
dotenv.config({path: './config/config.env'})

//Handling uncaught exception
process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down - uncaught exception');
    process.exit(1);
})

connectDatabase();

//Setup body parser
app.use(express.json());


const jobs = require('./Routes/jobs.js');


app.use('/api/v1',jobs)

//handle unhandled routes : handles all routes(*) so written at appropriate point in file
app.all('*', (req,res,next) =>{
    next(new ErrorHandler(`${req.originalUrl} : route not found`, 404));
});

//Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT
const server = app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode!`);
})

//handling unhandled promise rejection
process.on('unhandledRejection', err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server - Unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
});

