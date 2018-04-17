const express = require('express');
const app = express();
const mongoose = require("mongoose");  // mongoose
// socket.io
const server = require('http').createServer(app);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader('Access-Control-Allow-Credentials', false);
  next();
});

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')


mongoose.connect('mongodb://192.168.1.111/im')  //连接数据库
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
    console.log('MongoDB连接成功！！')
})

// 路由
const user = require('./routes/user');


//服务器提交的数据json化
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//sesstion 存储
app.use(cookieParser())
app.use(session({
  secret: 'im',
  resave: false,
  saveUninitialized: true
}))

// 路由
app.use('/user',user);

// socket
require('./websocket.js')(server);


app.get('/', function (req, res) {
   res.send('Hello World');
})
 
server.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})