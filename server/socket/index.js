  
const format = require('../configue/response')
module.exports = function (io) {
  const userAll = new Set()
  // 连接socket.io
  io.on('connection', socket => {
    socket.emit('access', '有人上线了')

    // 接收消息
    socket.on('message', msg => {
      socket.emit('jieshou', msg)
    })

    socket.on('disconnection', () => {
      socket.emit('/leave', '有人离开了')
    })

    // 获取当前用户列表
    // socket.on('/user/list', callback => {
    //   callback(format.success())
    // })

    // // 登录
    // 用户端传入多个数据直接放后面添加，不需要括号，后端接收需要括号
    // 前端传入：socket.emit('/user/singIn', 'hny', res => {})

    // socket.on('/user/singIn', (user, callback) => {
    //   userAll.add(user)
    //   callback(format.success([...userAll], '登录成功'))
    //   console.log('新用户', user, userAll)
    // })
  })
}