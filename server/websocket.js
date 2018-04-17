function websocket(server) {
    let io = require('socket.io')(server);
    // io.origins(['http://localhost:8080']);

    let users = {}
    
    io.on('connection', function (socket) {
        socket.on('send msg', data => {
              let message = data;
              io.to(message.roomId).emit('receive msg', message)
        })

        socket.on('join-room' , data => {
            socket.userName = data.userName
            socket.nickName = data.nickName
            socket.roomId = data.roomId
            if (!users[data.roomId]) {
                users[data.roomId] = {}
            }
            users[data.roomId][data.userName] = data
            socket.join(data.roomId)
            io.to(data.roomId).emit('user joined', {
                users : users[data.roomId],
                jlMsg: `${data.nickName}加入聊天`
            })
        })

        socket.on('leave-room', data => {
              let isIn = Object.hasOwnProperty.call(users[data.roomId], data.userName)
              if (isIn) {
                delete users[data.roomId][data.userName]
             io.to(data.roomId).emit('user leaved', {
                 users: users[data.roomId],
                 jlMsg: `${data.nickName}离开聊天`
             })
                socket.leave(data.roomId)
              }
        })
        
        socket.on('disconnect', function () {
            if (users[socket.roomId] && users[socket.roomId].hasOwnProperty(socket.userName)) {
              delete users[socket.roomId][socket.userName]
              // 用户监听用退出聊天室
              socket.leave(socket.roomId)
              io.to(socket.roomId).emit('user leaved', {
                users: users[socket.roomId],
                jlMsg: `${socket.nickName}离开聊天`
              })
            }
          })
    })
}

module.exports = websocket