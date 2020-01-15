const express = require('express')
const router = express.Router()
const formidable = require('formidable'); // 接收文件上传
const path = require('path');
const fs = require('fs')
const msgdb = require('../mongo/model')
const mineType = require('mime-types') // 转换base64插件
const response = require('../configue/response')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}
const UPLOAD_DIR = resolve('../uploads')

router.get('/list', (req, res) => {
  msgdb.findMessageAll({}, { message: 1, fileName: 1, filePath: 1, _id: 0 }, { sort: { date: -1 } }, (err, docs) => {
    if (err) {
      return res.send({ code: 500, message: '数据查询出错' })
    }
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

// 合并切片处理
const mergeFileChunk = (filePath) => {
  console.log('开始合并切片')
  return new Promise(resolve => {
    // 打包的目录带pack
    let packFilename = `${filePath}_pack`
    if (fs.existsSync(packFilename)) {
      const chunkPaths = fs.readdirSync(packFilename)
      fs.writeFileSync(filePath, '')
      // 循环添加数据
      chunkPaths.forEach(chunkPath => {
        fs.appendFileSync(filePath, fs.readFileSync(`${packFilename}/${chunkPath}`))
        fs.unlinkSync(`${packFilename}/${chunkPath}`);
      })
      // 写入完成删除文件
      fs.rmdirSync(packFilename)
      // 将文件的大小返回
      let stas = fs.statSync(filePath)
      resolve(stas.size)
    } else {
      resolve(0)
    }
  })
}

router.post('/verify', (req, res) => {
  let { filename } = req.body
  if (fs.existsSync(`${UPLOAD_DIR}/${filename}`)) {
    res.send({ shouldIgnore: false })
  } else {
    res.send({ shouldIgnore: true })
  }
  console.log(filename, 'filename')
})

// 合并请求
router.post('/merge', async (req, res) => {
  let { filename } = req.body
  let url = req.headers.host
  let extname = path.extname(filename) // 扩展后缀
  const filePath = `${UPLOAD_DIR}/${filename}`
  let fileSize = await mergeFileChunk(filePath)
  if (!fileSize) {
    res.send(response.fail('合并失败'))
    return
  }
  // 计算文件大小
  if (fileSize > 1024 * 1024) {
    fileSize = parseFloat(fileSize / 1024 / 1024).toFixed(2) + 'MB'
  } else {
    fileSize = parseFloat(fileSize / 1024).toFixed(2) + "KB"
  }

  // 将图片转换base64，因为img地址加载太慢
  let base64 = ''
  if (extname.match(/png|jpg|gif|jpeg/)) {
    let data = fs.readFileSync(filePath)
    data = new Buffer(data).toString('base64')
    base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
  }

  // 存储数据库
  msgdb.addMessage({ message: base64, fileName: `${filename}<i class='file-size'>${fileSize}<i>`, filePath: `http://${url}/file/${filename}` }, err => {
    console.log('存储数据库')
    res.send({ message: base64, fileName: `${filename}<i class='file-size'>${fileSize}<i>`, filePath: `http://${url}/file/${filename}` })
  })
})

// 上传文件
router.post('/upload', (req, res) => {
  console.log('请求上传成功')

  // 防止文件夹不存在, 执行下创建
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
  let form = new formidable.IncomingForm()
  form.uploadDir = UPLOAD_DIR // 上传文件地址

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.send(response.fail(`文件上传失败${err}`))
      return
    }

    let uploadPath = files.chunk // 文件
    if (!uploadPath) {
      res.send(response.fail('没有读取到文件, 请重新调试'))
      return
    }

    let fullname = fields.hash // 文件名字
    let filename = fields.filename
    let packFilename = filename + '_pack'
    // 判断目录是否存在, 因为切片要重复往里面放入文件
    if (!fs.existsSync(`${UPLOAD_DIR}/${packFilename}`)) {
      fs.mkdirSync(`${UPLOAD_DIR}/${packFilename}`)
    }

    let filePath = `${UPLOAD_DIR}/${packFilename}/${fullname}`

    // 修改名字
    fs.rename(uploadPath.path, filePath, err => {
      if (err) return res.send(response.fail(`修改失败：${err}`))
      console.log('文件修改成功')
      res.send(response.success('上传成功'))
    })
  })
})

// 清空文件
router.post('/clearFile', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.send(`清空出错了：${err}`)
    files.forEach(curPath => {
      fs.unlink(`${UPLOAD_DIR}/${curPath}`, (err) => {
        if (err) return res.send(`删除失败：${err}`)
      })
    })
    res.send('清空成功')
  })
})

module.exports = router
