ideServices.service("socketIOService",[function(){var t,e={};this.createSocket=function(e){t=io("https://test.graphichina.com"),t.on("connect",function(){e&&e()})},this.on=function(e,n){t.on(e,n)},this.emit=function(e,n){t.emit(e,n)},this.setRoomUsers=function(t){e=t},this.getRoomUsers=function(){return e},this.addUserInRoom=function(t){return e.push(t)},this.deleteUserInRoom=function(t){for(var n=0,i=e.length;n<i;n++)if(e[n].id===t.id){e.splice(n,1);break}return e}}]);