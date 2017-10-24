/**
 * socket io 服务，用于创建socketIO 监听 事件
 * create by lixiang in  10/22/2017
 */

ideServices.service('socketIOService',[function(){
    var socket;
    var roomUsers={};

    this.createSocket = function(cb){
        socket = io('https://test.graphichina.com');
        socket.on('connect',function(){
            cb&&cb();
        })
    };

    this.on = function(evtName,cb){
        socket.on(evtName,cb);
    };

    this.emit = function(evtName,data){
        socket.emit(evtName,data);
    };

    this.setRoomUsers = function(users){
        roomUsers = users;
    };

    this.getRoomUsers = function () {
        return roomUsers;
    };

    this.addUserInRoom = function (user) {
        return roomUsers.push(user);
    };

    this.deleteUserInRoom = function (user) {
        for(var i=0,il=roomUsers.length;i<il;i++){
            if(roomUsers[i].id===user.id){
                roomUsers.splice(i,1);
                break;
            }
        }
        return roomUsers;
    }

}]);