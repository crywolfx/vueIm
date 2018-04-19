const mongoose = require('mongoose');


//申明一个mongoons对象
const MessageSchema = new mongoose.Schema({
    userName: String,   // 用户名
    nickName: String,  // 昵称
    src: String,  // 头像
    msg: {  // 文本消息
      type: String,
      default: ''
    },
    roomId: String,  // 房间号
    img: {  // 图片消息
      type: String,
      default: ''
    },
    time: String,  // 时间
    timeReall: {  // 时间
      type: Date,
      default: Date.now()
    }
})


//查询的静态方法
MessageSchema.statics = {
    fetch: function(callback) { //查询所有数据
        return this
            .find()
            .sort('timeReall') //排序
            .exec(callback) //回调
    },
    findById: function(id, callback) { //根据id查询单条数据
        return this
            .findOne({
                _id: id
            })
            .exec(callback)
    }
}

module.exports = mongoose.model('Message', MessageSchema)