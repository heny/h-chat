require('./mongo/connect')
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

const debug = require('debug')('my-application')


app.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,OPTIONS');
  next()
})

// 注意顺序  必须在msgRoutes之前挂载中间件
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

const msgRoutes = require('./routes/messageRouter')
app.use('/msg', msgRoutes)
io.on('connection', socket => {
  socket.on('message', msg => {
    io.emit('jieshou', msg)
  })
})

// 开放uploads文件夹提供下载文件
app.use('/file', express.static('uploads'))

var port = process.env.PORT || 8886
server.listen(port, _ => {
  debug('8888端口监听成功')
})

app.get('/', (req, res) => {
  res.send('服务启动成功')
})
