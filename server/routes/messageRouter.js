const express = require('express')
const router = express.Router()
const formidable = require('formidable'); // 接收文件上传
const path = require('path');
const fs = require('fs')
const msgdb = require('../mongo/model')
const mineType = require('mime-types')

router.get('/list', (req, res) => {
  msgdb.findMessageAll({}, { message: 1, fileName: 1, filePath: 1, _id: 0 }, { sort: { date: -1 } }, (err, docs) => {
    if (err) throw new Error()
    res.send(docs)
  })
})

router.post('/add', (req, res) => {
  console.log(req.body, '333333333333333333333后台接收')
  msgdb.addMessage(req.body, err => {
    res.send('添加成功')
  })
})

router.post('/del', (req, res) => {
  msgdb.updateMessage({}, err => {
    res.send('删除成功')
  })
})
// 上传文件
router.post('/upload', (req, res) => {
  console.log('请求上传成功')

  let form = new formidable.IncomingForm()
  let fullPath = path.resolve(__dirname, '../uploads/')
  form.uploadDir = fullPath // 上传文件地址

  form.parse(req, (err, fields, files) => {
    if (err) return res.send(`文件上传失败：${err}`)
    let uploadPath = files.file // 文件
    let fullname = uploadPath.name // 文件名字
    let extname = path.extname(fullname) // 扩展后缀

    // 计算文件大小
    let fileSize
    if (uploadPath.size > 1024 * 1024) {
      fileSize = parseFloat(uploadPath.size / 1024 / 1024).toFixed(2) + 'MB'
    } else {
      fileSize = parseFloat(uploadPath.size / 1024).toFixed(2) + "KB"
    }
    let filePath = `${fullPath}/${fullname}`
    // 修改名字
    fs.rename(uploadPath.path, filePath, err => {
      fields.file = fullname // 上传成功的文件名字
      let url = req.headers.host

      // 将图片转换base64，因为img地址加载太慢
      let base64 = ''
      if (extname.match(/png|jpg|gif|jpeg/)) {
        let data = fs.readFileSync(filePath)
        data = new Buffer(data).toString('base64')
        base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
      }

      msgdb.addMessage({ message: base64, fileName: `${fullname}<i class='file-size'>${fileSize}<i>`, filePath: `http://${url}/file/${fullname}` }, err => {
        res.send({ message: base64, fileName: `${fullname}<i class='file-size'>${fileSize}<i>`, filePath: `http://${url}/file/${fullname}` })
      })
    })
  })
})

// 清空文件
router.post('/clearFile', (req, res) => {
  let fullPath = path.resolve(__dirname, '../uploads')
  fs.readdir(fullPath, (err, files) => {
    if (err) return res.send(`清空出错了：${err}`)
    files.forEach(curPath => {
      fs.unlink(fullPath + '/' + curPath, (err) => {
        if (err) return res.send(`删除失败：${err}`)
      })
    })
    res.send('清空成功')
  })
})

module.exports = router
