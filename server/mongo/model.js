const mongoose = require('mongoose')
let Schemas = new mongoose.Schema({
  message: String,
  date: {
    type: Date,
    default: Date.now()
  }
})
const models = mongoose.model('msg', Schemas)

// 发送消息
const addMessage = (data, callback) => {
  // 默认时间不会更新
  data.date = new Date()
  models.create(data, err => {
    if(err) {
      return callback(err)
    } else {
      return callback(null)
    }
  })
}

// 查询消息
const findMessageAll = (conditions,projection,options,callback) => {
  models.find(conditions,projection,options,(err,docs)=>{
      if(err){  //查询失败;
          return callback(err,[])
      }else{   //查询成功
          return callback(null,docs);
      }
  })
}

const updateMessage = (conditions, data, callback) => {
  models.deleteMany(conditions, data, err => {
    if(err) {
      return callback(err)
    } else {
      return callback(null)
    }
  })
}

module.exports = { addMessage, findMessageAll, updateMessage }
