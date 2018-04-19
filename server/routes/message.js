const express = require('express');
const router = express.Router();

const Message = require('../schemas/message');

 // 信息
 router.post('/message', (req, res) => {
    const id = req.body.roomId
    Message.find({roomId: id}).sort({"timeReall": -1}).limit(80).exec((err, message) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: true,
          data: message.reverse()
        })
      }
    })
  }),
  // 获取历史记录
  router.post('/history/message', (req, res) => {
    const id = req.query.roomid
    const current = req.query.current
    if (!id || !current) {
      res.json({
        success: false
      });
    }
    const message = {
      success: true,
      data: {},
      total: 0,
      current: current
    }
    const task1 = new Promise((resolve, reject) => {
      const skip = parseInt((current - 1) * 40)
      Message.find({roomid: id}).skip(skip).limit(40).exec((err, data) => {
        if (err) {
          return reject()
        } else {
          message.data = data
          return resolve()
        }
      })
    })
    const task2 = new Promise((resolve, reject) => {
      Message.find({roomid: id}).count().exec((err, data) => {
        if (err) {
          return reject()
        } else {
          message.total = data
          return resolve()
        }
      })
    })
    Promise.all([task1, task2]).then(() => {
      res.json({
        data: message
      })
    })
  }),


module.exports = router;