const mongoose = require('mongoose');
//用于md5加密
const bcrypt = require('bcryptjs')
//加盐数
var SALT_WORK_FACTOR = 10

//申明一个mongoons对象
const UserSchema = new mongoose.Schema({
    userName: {
        unique: true,
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    nickName: {
        type: String,
        require: true
    },
    sex: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    meta: {
        createAt: {
            type: Date,
            dafault: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

//对密码进行加密 每次调用都会执行
UserSchema.pre('save', function (next) {
    let user = this
    if (this.isNew) {
      this.createAt = this.updateAt = Date.now()
    }
    else {
      this.updateAt = Date.now()
    }
    
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err)
  
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
  
        user.password = hash
        next()
      })
    })
  })

//用于比较密码是否正确
UserSchema.methods = {
    comparePassword: function (_password, cb) {
      bcrypt.compare(_password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err)
        }
        cb(null, isMatch)
      })
    }
  }

//查询的静态方法
UserSchema.statics = {
    fetch: function(callback) { //查询所有数据
        return this
            .find()
            .sort('meta.updateAt') //排序
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

module.exports = mongoose.model('Users', UserSchema)