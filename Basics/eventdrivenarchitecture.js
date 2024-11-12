let events = require('events')

let eventEmitter = new events.EventEmitter() //creating event emitter

eventEmitter.on('connection',()=>{      //listener for the event
    console.log('Connection successful')
})

eventEmitter.emit('connection')   //emitting the event