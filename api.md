## API

### POST  

### USER 用户相关  

- #### /user/checkName 用户名检测


    ```
    接收:
    body: {
            userName: (String) // 用户名
    }

    返回:
    data: {

    ​	 success:  (Boolean)  // 是否被注册

    ​	 msg: (String)  // 相关信息

    }
    ```

- #### /user/reg 注册


    ```
    接收:
    body: {
            userInfo: {          (Object) // 用户信息
                userName,
                password,
                nickName,
                age,
                sex,
            } 
    }
    
    返回:
    data: {

    ​	 success:  (Boolean)  // 是否注册成功

    ​	 userInfo:  (Object)  // 用户信息

    }
    ```
- #### /user/login  登录
    ```
    接收:
    body: {
        userName:   (String) // 用户名
        password:   (String) // 密码
    }
    
    返回:
    data: {

            userInfo: {          (Object) // 用户信息
                userName,
                password,
                nickName,
                age,
                sex,
            } 

    }
    ```
- #### /user/upload/user  用户头像上传  

    formdata格式


    ```
    接受:
    formdata {

    ​	file: (Object)  // file文件

    ​	userName:  (String)  //用户名

    }

    返回: 
    body:{
        success:    (Boolean) 
        data:   (String)   // 图片url
    }
    ```
- #### /user/msg   消息图片上传

    formdata格式


    ```
    接受:
    formdata {

    ​	file: (Object)  // file文件

    ​	userName:  (String)  //用户名

    ​	msgType:  (String) (msg || user)  //类型（消息图片/头像图片）
    }

    返回: 
    body:{
        success:    (Boolean) 
        data:   (String)   // 图片url
    }
    ```
### MESSAGE 消息相关
- #### /message/message  获取历史消息

    ```
    接受:
    body: {
        roomId
        
    }

    返回: 
    body:{
        success:    (Boolean) 
        data:     (Array)
    }
    ```
### ROOM 房间相关
- #### /room/findlist  已加入群组列表

    ```
    接受:
    body: {

        userName:   (String)    // 用户名

    }

    返回: 
    body:{
        success:    (Boolean) 
        list:     (Array)
    }
    ```
- #### /room/checkname  检查群组id是否被注册

    ```
    接受:
    body: {

        roomId

    }

    返回: 
    body:{
        success:    (Boolean) 
        msg:     (String)
    }
    ```
- #### /room/saveroom  创建群组

    ```
    接受:
    body: {

        roomInfo: {     (Object)
            roomId,     // 房间id
            roomUser,   // 房间创建人
            roomName,   // 房间名称
            src,        // 房间头像地址
            member,     // 房间成员（创建人也加入）
        }

    }

    返回: 
    body:{
        success:    (Boolean) 
        roomInfo:   (Object)
    }
    ```
- #### /room/joinroom  加入群组

    ```
    接受:
    body: {

        userName:   (String)    // 用户名
        roomId:     (String)    // 房间号
    }

    返回: 
    body:{
        success:    (Boolean) 
        msg:   (String)
    }
    ```
- #### /room/leaveroom  退出群组

    ```
    接受:
    body: {

        userName:   (String)    // 用户名
        roomId:     (String)    // 房间号
    }

    返回: 
    body:{
        success:    (Boolean) 
        msg:   (String)
    }
    ```
- #### /room/delroom  退出群组

    ```
    接受:
    body: {

        userName:   (String)    // 用户名
        roomId:     (String)    // 房间号
    }

    返回: 
    body:{
        success:    (Boolean) 
        msg:   (String)
    }
    ```
- #### /room/roomInfo  群组信息

    ```
    接受:
    body: {

        roomId:     (String)    // 房间号

    }

    返回: 
    body:{
        success:    (Boolean) 
        roomInfo:   (Object)
    }
    ```
- #### /room/upload/room  群头像上传

    ```
    接受:
    formdata {

    ​	file: (Object)  // file文件

    ​	roomId:  (String)  // 房间号


    }

    返回: 
    body:{
        success:    (Boolean) 
        data:   (String)        // url
    }
    ```