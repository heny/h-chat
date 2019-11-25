require('./mongo/connect')
const app = require('express')()
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const msgdb = require('./mongo/model')


io.on('connection', socket => {
  socket.on('message', msg => {
    io.emit('jieshou', msg)
  })
})

var port = process.env.PORT || 3006
server.listen(port, _ => {
  console.log('3006端口监听成功')
})


// 接收body参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', (req,res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,OPTIONS');
  next()
})
app.get('/',(req,res) => {
	res.send('服务启动成功')
})

app.get('/msglist', (req,res) => {
  msgdb.findMessageAll({}, {message: 1, _id: 0}, {sort: {date: -1}}, (err, docs) => {
    if(err) throw new Error()
    res.send(docs)
  })
})

app.post('/addmsg', (req,res) => {
  console.log(req.body, '333333333333333333333后台接收')
  msgdb.addMessage(req.body, err => {
    res.send('添加成功')
  })
})

app.post('/delmsg', (req,res) => {
  msgdb.updateMessage({}, err => {
    res.send('删除成功')
  })
})
