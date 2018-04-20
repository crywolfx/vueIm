const mongoose = require('mongoose');


//申明一个mongoons对象
const RoomSchema = new mongoose.Schema({
    roomUser: String,
    roomName: String,
    roomId: {
        type: String,
        unique: true
    },
    src: {
        type:String,
        default: ''
    },
    member: {
        type: Array,
        default: []
    },
    time: {  // 时间
      type: Date,
      default: Date.now()
    }
})


//查询的静态方法
RoomSchema.statics = {
    fetch: function(callback) { //查询所有数据
        return this
            .find()
            .sort('time') //排序
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

module.exports = mongoose.model('Room', RoomSchema)