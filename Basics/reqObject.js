const express = require('express')
const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    console.log(req.method)
    res.status(200).json({
        message:'All about req obj'
    })
})

app.post('/',(req,res)=>{
    console.log(req.method)
    console.log(req.body)
})
app.listen(3000,()=>{
    console.log('Server started')
})