module.exports = (listener) => {

  const io = require('socket.io').listen(listener)

  const users = ['Finn', 'Tom']

  io.on('connection', (socket) => {
    io.emit('LIST', users)

    socket.on('SEND', ({ name, target, method, data }) => {
      console.log('GET SEND');
      io.emit(target, {from: name, method, data})
    })

  })
}
