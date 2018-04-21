const express = require('express');
const router = express.Router();
const multer = require('multer'); //接收图片
const Room = require('../schemas/room');
const Message = require('../schemas/message');
// 房间是否注册
router.post('/checkname', (req, res) => {
    Room.findOne({
        roomId: req.body.roomId
    }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        if (doc) {
            res.json({
                success: false,
                msg: "该房间id已被注册"
            })
        } else {
            res.json({
                success: true,
                msg: "该房间id未被注册"
            })
        }

    })
});
router.post('/findlist',function (req,res,next) {
    Room.find({member:req.body.userName}, (err,doc) => {
        if(err) {
            console.log(err);
        }
        if (doc) {
            res.json({
                success: true,
                list: doc
            })
        }else {
            res.json({
                success: false,
                list: []
            })
        }
    })
})
// 创建群组
router.post('/saveroom', function(req, res, next) {
    const roomInfo = new Room(req.body);
    roomInfo.save((err, doc) => {
        if (doc) {
            res.json({
                success: true,
                roomInfo: doc
            })
        }
    })
})

// 加入群组
router.post('/joinroom', function(req, res, next) {
    let userName = req.body.userName;
    let roomId = req.body.roomId;
    changeMember(roomId, { member : userName },'push')
        .then( result => {
            res.json({
                success: true,
                msg: '加入群组成功'
            })
        })
        .catch( err => {
            res.json({
                success: false,
                error: err
            })
        })
})

// 退出群组
router.post('/leaveroom', function(req, res, next) {
    let userName = req.body.userName;
    let roomId = req.body.roomId;
    changeMember(roomId, { member : userName },'pull')
    .then( result => {
        res.json({
            success: true,
            msg: '退出群组成功'
        })
    })
    .catch( err => {
        res.json({
            success: false,
            error: err
        })
    })
})

// 解散群组

router.post('/delroom', function(req, res, next) {
    let userName = req.body.userName;
    let roomId = req.body.roomId;
    roomInfo(roomId)
        .then( result => {
            if(result.roomUser == userName){
                Room.remove( {roomId : roomId}, (error) => {
                    if(error){
                        res.json({
                            success:false,
                            msg:'解散群组失败'
                        })
                    } else {
                        Message.remove({roomId : roomId}, (error) => {
                            if(error) {
                                res.json({
                                    success: false,
                                    msg: '解散群组成功但删除聊天记录失败'
                                })
                            }else {
                                res.json({
                                    success:true,
                                    msg:'解散群组成功'
                                })
                            }
                        })
                    }
                })
            }else {
                res.json({
                    success:false,
                    msg:'你没有权限操作'
                })
            }
        })
})

// 获取群组信息
router.post('/roomInfo', function(req, res, next) {
    let roomId = req.body.roomId;
    roomInfo(roomId).then( result => {
        res.json({
            success:true,
            roomInfo: result
        })
    }).catch( err => {
        res.json({
            success:false,
            err: err
        })
    })
})

// 更新群组成员
function changeMember(roomId,newDoc,type) {
    return new Promise( (resolve,reject) => {
        let conditions = { roomId: roomId };
        let updates = {};
        if(type === 'push'){
            updates = { $push: newDoc }
        }else if (type === 'pull') {
            updates = { $pull: newDoc } 
        }  
        Room.update(conditions, updates, function(error) {
            if (error) {
                reject("群组成员更新失败")
            } else {
                resolve({success:true})
            }
        });
    })
}

// 查看房间信息
function roomInfo(roomId) {
    return new Promise( (resolve, reject) => {
        Room.findOne({
            roomId: roomId
        }, (err, doc) => {
            if (err) {
                console.log(err);
            }
            if (doc) {
                resolve(doc)
            } else {
                reject('error')
            }
        })
    })
}
// 图片上传  
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/room')
    },
    filename: function(req, file, cb) {
        cb(null, req.body.roomId + '-' + file.originalname);
    }
});

let upload = multer({
    storage: storage
}); //定义图片上传的临时目录

// 头像
router.post('/upload/room', upload.single('file'), function(req, res, next) {
    let url = 'http://' + req.headers.host + '/room/' + req.file.filename;
    let roomId = req.body.roomId;
    res.json({
        success: true,
        data: url,
    });
    res.end();
});
module.exports = router;