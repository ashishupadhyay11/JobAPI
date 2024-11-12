const http = require('http')
const data =[ {
        name: 'John',
        id: 1
    },
    {
        name: 'Bon',
        id: 2
    },
    {
        name: 'Kon',
        id: 3
    }
]
const server = http.createServer((req,res)=>{
    res.setHeader('Content-Type', 'application/JSON')
    res.setHeader('Content-Language', 'en-US')
    res.setHeader('Data', new Date(Date.now()))
    res.setHeader('X-Powered-By', 'Node.js')
    res.end(
        JSON.stringify({
            success: true,
            results: data.length,
            data: data
    })
)
})

server.listen(3000,()=>{
    console.log('Server is started')
})