const _baseUrl = 'http://192.168.1.116:3000'

export default {
    checkUserName() {
        return `${_baseUrl}/user/checkName`
    },
    reg() {
        return `${_baseUrl}/user/reg`
    },
    login() {
        return `${_baseUrl}/user/login`
    },
    userUpload() {
        return `${_baseUrl}/user/upload/user`
    },
    msgUpload() {
        return `${_baseUrl}/user/msg`
    },
    getMessage() {
        return `${_baseUrl}/message/message`
    },
    checkRoomName() {
        return `${_baseUrl}/room/checkname`
    },
    findList() {
        return `${_baseUrl}/room/findlist`
    },
    saveRoom() {
        return `${_baseUrl}/room/saveroom`
    },
    joinRoom() {
        return `${_baseUrl}/room/joinroom`
    },
    leaveRoom() {
        return `${_baseUrl}/room/leaveroom`
    },
    delRoom() {
        return `${_baseUrl}/room/delroom`
    },
    roomInfo() {
        return `${_baseUrl}/room/roomInfo`
    },
    roomUpload() {
        return `${_baseUrl}/room/upload/room`
    },
    socket() {
        return `${_baseUrl}`
    }
}
