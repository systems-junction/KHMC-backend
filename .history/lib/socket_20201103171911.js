// const io = require('socket.io');
// const users = require('./users');

// /**
//  * Initialize when a connection is made
//  * @param {SocketIO.Socket} socket
//  */



// function initSocket(socket) {
//   let id;
//   socket
//     .on('init', async () => {
//       console.log("init called")
//       id = await users.create(socket);
//       socket.emit('init', { id });
//     })

//     .on('request1', (data) => {
//       console.log("data in request function", data)
//       const receiver = users.get(data.to);
//       // console.log("id while receiving",id)
//       // if (receiver) {
//         socket.emit('request',  data );
//       // }
//     })
//     .on('call', (data) => {
//       console.log("data in call function", data)
//       const receiver = users.get(data.to);
//       if (receiver) {
//         receiver.emit('call', { ...data, from: id });
//       } else {
//         socket.emit('failed');
//       }
//     })
//     .on('end', (data) => {
//       const receiver = users.get(data.to);
//       if (receiver) {
//         receiver.emit('end');
//       }
//     })
//     .on('disconnect', () => {
//       users.remove(id);
//       console.log(id, 'disconnected');
//     });
// }




module.exports = (server) => {
  // io({ path: '/bridge', serveClient: false })
  // io.listen(server, { log: true })
  //   .on('connection', initSocket)
  var app = require('express')();
  var http = require('http').createServer(app);
  
var io = require('socket.io')(http);

io.on('connection3', (socket) => {
  console.log('a user connected');
});

http.listen(5000, () => {
  console.log('listening on *:3000');
});
};
