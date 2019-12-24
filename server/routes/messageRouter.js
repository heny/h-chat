const route = require('express')()

route.get('/msglist', (req,res) => {
  msgdb.findMessageAll({}, {message: 1, _id: 0}, {sort: {date: -1}}, (err, docs) => {
    if(err) throw new Error()
    res.send(docs)
  })
})

route.post('/addmsg', (req,res) => {
  console.log(req.body, '333333333333333333333后台接收')
  msgdb.addMessage(req.body, err => {
    res.send('添加成功')
  })
})

route.post('/delmsg', (req,res) => {
  msgdb.updateMessage({}, err => {
    res.send('删除成功')
  })
})
