/**
 * Created by lixiang on 16/3/15.
 */
ideServices
    .service('TimerService',[function(){
    var timerNum=null;
    this.setTimerNum=function(num){
        //console.log("set num success!");
        timerNum=num;
    };
    this.getTimerNum=function(){
        return timerNum;
    }
}]);