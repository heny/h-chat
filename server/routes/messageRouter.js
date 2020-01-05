const express = require('express')
const router = express.Router()
const msgdb = require('../mongo/model')

router.get('/list', (req,res) => {
  msgdb.findMessageAll({}, {message: 1, _id: 0}, {sort: {date: -1}}, (err, docs) => {
    if(err) throw new Error()
    res.send(docs)
  })
})

router.post('/add', (req,res) => {
  console.log(req.body, '333333333333333333333后台接收')
  msgdb.addMessage(req.body, err => {
    res.send('添加成功')
  })
})

router.post('/del', (req,res) => {
  msgdb.updateMessage({}, err => {
    res.send('删除成功')
  })
})

module.exports = router
