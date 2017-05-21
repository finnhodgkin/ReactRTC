// Create hapi server
const hapi = require('hapi')
const server = new hapi.Server()

server.connection({
  port: process.env.PORT || 4000,
})

const socket = require('./socket')

server.start(err => {
  if (err) throw err

  socket(server.listener)

  console.log(`Server started at ${server.info.uri}`)
})
