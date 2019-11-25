const app = require('express')()
const server = require('http').createServer(app);
const io = require('socket.io')(server)
app.get('/',(req,res) => {
	res.send('暂时没有东西呢')
})
io.on('connection', soket => {
  soket.on('message', msg => {
    console.log(msg, '后端处理')
    io.emit('jieshou', msg)
  })
})
server.listen(80, _ => {
  console.log('监听成功')
})
