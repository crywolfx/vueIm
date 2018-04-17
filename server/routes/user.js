const express = require('express');
const router = express.Router();

const User = require('../schemas/user');

router.post('/test', function(req, res) {
    console.log(req.body.userName);
});
// 用户名检查
router.post('/checkName', function(req, res) {
    User.findOne({ //查一下有没有该用户名
        userName: req.body.userName
    }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        if (doc) {
            res.json({
                success: false,
                msg: "该帐号已被注册"
            })
        } else {
            res.json({
                success: true,
                msg: "该帐号未被注册"
            })
        }

    })
});

// 注册表单
router.post('/reg', function(req, res, next) { //注册
    let _user = req.body;
    const user = new User(_user)
    user.save((err, doc) => {
        if (doc) {
            res.json({
                success: true,
                userInfo: doc
            })
        }
    })
})

// 登录表单
router.post('/login', function (req,res) {
    let _user = req.body;
    let userName = _user.userName;
    let password = _user.password;
  
    User.findOne({userName:userName}, function (err, user) {
      if(err){
        console.log(err);
      }
      if(!user) {
        res.json({
            success: false,
            msg: "用户名不存在"
        })
        return false;
      }
  
      user.comparePassword(password, function (err, isMatch) {
        if (err){
          console.log(err);
        }
        if (isMatch) {
          req.session.user = user.userName; // 用户名存入session中
          let userInfo = {
              userName : user.userName,
              sex : user.sex,
              nickName: user.nickName,
              age : user.age
          }
          res.json({
            success: true,
            msg: "登陆成功",
            userInfo : userInfo
          })
        } else {
            res.json({
                success: false,
                msg: "密码错误"
            })
        }
      });
    });
  });







module.exports = router;