/**
 * socket io 服务，用于创建socketIO 监听 事件
 * create by lixiang in  10/22/2017
 */

ideServices.service('socketIOService',[function(){
    var socket;
    var roomUsers={};
    var initial = true
    this.createSocket = function(path,cb){
        socket = io(path||'');
        socket.on('connect',function(){
            if(initial){
                cb&&cb();
                initial = false
            }
            
        })
    };

    this.closeSocket = function(cb){
        socket.close();
        cb&&cb();
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
        roomUsers.push(user);
        return roomUsers
    };

    this.deleteUserInRoom = function (user) {
        for(var i=0,il=roomUsers.length;i<il;i++){
            if(roomUsers[i].id===user.id){
                roomUsers.splice(i,1);
                break;
            }
        }
        return roomUsers;
    };

    this.getSocket = function(){
        return socket;
    }

}]);