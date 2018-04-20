const express = require('express');
const router = express.Router();
const multer = require('multer'); //接收图片
const fs = require('fs');

const User = require('../schemas/user');

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
router.post('/login', function(req, res) {
    let _user = req.body;
    let userName = _user.userName;
    let password = _user.password;

    User.findOne({
        userName: userName
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            res.json({
                success: false,
                msg: "用户名不存在"
            })
            return false;
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                req.session.user = user.userName; // 用户名存入session中
                let userInfo = {
                    userName: user.userName,
                    sex: user.sex,
                    nickName: user.nickName,
                    age: user.age,
                    src: user.src,
                }
                res.json({
                    success: true,
                    msg: "登陆成功",
                    userInfo: userInfo
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

// 图片上传  
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(req.body.msgType == 'msg'){
            cb(null, './uploads/msg')
        }else {
            cb(null, './uploads/user')
        }
    },
    filename: function(req, file, cb) {
        if (req.body && req.body.userName) {
            if(req.body.msgType == 'msg') {
                cb(null, req.body.userName + '-' + Date.now() + '-' + file.originalname);
            }else{
                cb(null, req.body.userName + '-' + file.originalname);
            }
        }else {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }
});

let upload = multer({
    storage: storage
}); //定义图片上传的临时目录

// 头像
router.post('/upload/user', upload.single('file'), function(req, res, next) {
    let url = 'http://' + req.headers.host + '/user/' + req.file.filename;
    let userName = req.body.userName;
    res.json({
        success: true,
        data: url,
    });
    // 更新数据库图片
    var conditions = { userName: userName };
    var updates = {
        $set: {
            src: url
        }
    };  
    User.update(conditions, updates, function(error) {
        if (error) {
            console.error(error);
        } else {
            console.log("更新成功")
        }
    });
    res.end();
});

// 消息图片
router.post('/upload/msg', upload.single('file'), function(req, res, next) {
    let url = 'http://' + req.headers.host + '/msg/' + req.file.filename;
    res.json({
        success: true,
        data: url,
    });
    res.end();
});




module.exports = router;