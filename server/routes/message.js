const express = require('express');
const router = express.Router();

const Message = require('../schemas/message');

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


module.exports = router;