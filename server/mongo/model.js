const mongoose = require('mongoose')
let Schemas = new mongoose.Schema({
  message: String,
  fileName: String,
  filePath: String,
  fileSize: String,
  id: {
    type: Number,
    default: Math.random().toString().substr(3,6) // 用于查找标识
  },
  date: {
    type: Date,
    default: Date.now() // 用于排序
  }
})
const models = mongoose.model('msg', Schemas)

// 发送消息
const addMessage = (data, callback) => {
  // 默认时间不会更新
  data.date = new Date()
  models.create(data, err => {
    if (err) {
      return callback(err)
    } else {
      return callback(null)
    }
  })
}

// 查询消息
const findMessageAll = (conditions, projection, options, callback) => {
  models.find(conditions, projection, options, (err, docs) => {
    if (err) {  //查询失败;
      return callback(err, [])
    } else {   //查询成功
      return callback(null, docs);
    }
  })
}

// 清空所有
const updateMessage = (conditions, data, callback) => {
  models.deleteMany(conditions, data, err => {
    if (err) {
      return callback(err)
    } else {
      return callback(null)
    }
  })
}

// 删除一条
const delMessage = (conditions, callback) => {
  models.deleteOne(conditions, err => {
    if(err) {
      return callback(err)
    } else {
      return callback(null)
    }
  })
}

module.exports = { addMessage, findMessageAll, updateMessage, delMessage }
