ide.controller("TimerCtrl",["TimerService","TagService","$scope","$timeout",function(e,n,t,i){function r(){t.num=e.getTimerNum()}t.$on("GlobalProjectReceived",function(){r()}),t.enter=function(n){if(13===n.keyCode){var i=e.getTimerNum();if(!_.isInteger(parseInt(t.num)))return toastr.warning("输入不合法"),void(t.num=i);if(t.num>10||t.num<0)return toastr.warning("超出范围"),void(t.num=i);e.setTimerNum(t.num),t.setNum()}},t.setNum=function(){t.num=e.getTimerNum(),n.setTimerTags(t.num)}}]);