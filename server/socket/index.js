  
const format = require('../configue/response')

// 在線用戶
var onlineUsers = {}
// 當前用戶人數
var onlineCount = 0
var i = 0

module.exports = function (io) {
  // 连接socket.io
  io.on('connection', socket => {
    
    // 有人上线了
    socket.broadcast.emit('/access')
    socket.name = ++i
    onlineUsers[socket.name] = socket
    
    // 接收消息
    socket.on('message', msg => {
      io.emit('jieshou', msg)
    })

    // 有人离开了
    socket.on('disconnect', () => {
      socket.broadcast.emit('/leave')
      delete onlineUsers[socket.name]
    })

    // 修改昵称
    socket.on('/user/modify', nickName => {
      // 谁触发的这个事件, socket就代表谁
      delete onlineUsers[socket.name]
      socket.name = nickName
      onlineUsers[nickName] = socket
      socket.emit(`修改昵称为：${msg}`, socket)
    })

    // 获取当前人数
    socket.on('/user/list', callback => {
      callback(Object.keys(onlineUsers).length)
    })
  })
}
