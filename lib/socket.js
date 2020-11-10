const io = require('socket.io');
const users = require('./users');

const notificationRTC = require('../components/rtc_notification');

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket) {
  let id;
  socket
    .on('init', async (userId) => {
      console.log(userId);
      id = await users.create(socket, userId);
      socket.emit('init', { id });
    })
    .on('request', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('request', { from: id, to: data.to });
      } else {
        console.log('notification sent to user');
        notificationRTC(
          'Incoming Call',
          'You got a call from this person.',
          '5f4ffff4277ba8b380f2ef3d',
          '/home/rcm/chat'
        );
      }
    })
    .on('call', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('call', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('end', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('end');
      }
    })
    .on('disconnect', () => {
      users.remove(id);
      console.log(id, 'disconnected');
    });
}

module.exports = (server) => {
  // io({ path: '/bridge', serveClient: false })
  io.listen(server, { log: true }).on('connection', initSocket);

  // .on('connection', (socket) => {
  //   console.log("socket", socket.id)
  //     socket.on('init', async (userId) => {
  //       console.log(userId);
  //     let  id = await users.create(socket, userId);
  //       socket.emit('init', { id });
  //     })
  //     socket.on('request', (data) => {
  //       console.log("data in request",data)
  //       const receiver = users.get(data.to);
  //       if (receiver) {
  //         socket.broadcast.emit('request', { from: data.from, to:data.to });
  //       }
  //     })
  //   socket.on('call', (data) => {
  //     const receiver = users.get(data.to);
  //     if (receiver) {
  //       socket.broadcast.emit('call', { ...data, from: data.from });
  //     } else {
  //       socket.emit('failed');
  //     }
  //   })
  //   .on('end', (data) => {
  //     const receiver = users.get(data.to);
  //     if (receiver) {
  //       receiver.emit('end');
  //     }
  //   })
  //   .on('disconnect', () => {
  //     users.remove(id);
  //     console.log(id, 'disconnected');
  //   });
  // });
};
