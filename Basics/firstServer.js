const http = require('http')

const server = http.createServer((req,res) =>{
    res.end('first web server') //send response to browser (ctrl+c to stop sv)
})

server.listen(3000,()=>{
    console.log('server started') 
})