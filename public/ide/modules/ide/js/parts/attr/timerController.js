
ide.controller('TimerCtrl',['TimerService','TagService','$scope','$timeout',function (TimerService,TagService,$scope,$timeout) {
    $scope.$on('GlobalProjectReceived', function () {

        initProject();

    });
    $scope.enter=function(ev){
        if(ev.keyCode!==13){
            return;
        }
        var initNum = TimerService.getTimerNum();
        if (!_.isInteger(parseInt($scope.num))){
            toastr.warning('输入不合法');
            $scope.num=initNum;
            return;
        }
        if($scope.num>10||$scope.num<0){

            toastr.warning('超出范围');
            $scope.num=initNum;
            return;
        }
        TimerService.setTimerNum($scope.num);
        $scope.setNum();
    };

    //$scope.$watch('num', function (newVal,oldVal,scope) {
    //    TimerService.setTimerNum(newVal);
    //});
    $scope.setNum= function () {
        $scope.num=TimerService.getTimerNum();
        TagService.setTimerTags($scope.num);
    }
    function initProject(){
        $scope.num=TimerService.getTimerNum();
    }

}]);