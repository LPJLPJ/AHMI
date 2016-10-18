/**
 * Created by ChangeCheng on 16/4/1.
 */
ide.controller('ViewCtl',['$scope','ViewService','ProjectService',function($scope,ViewService,ProjectService){
    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
    });

    function initUserInterface () {
        $scope.defaultRatios = ['25%','50%','75%','100%','125%','150%','175%','200%','225%','250%'];



        readDefaultScale();

        $scope.ratioRange = {
            min:25,
            max:250
        }
    };

    function readDefaultScale(){
        if (ProjectService.isEditingPage()){
            $scope.isEditingPage = true;
            //page
            $scope.viewRatio = ViewService.getScale('page');
        }else{
            $scope.isEditingPage = false;
            //canvas
            $scope.viewRatio = ViewService.getScale('canvas');
        }
    }

    function initProject() {
        /**
         * change ratio by input a value
         */
        //$scope.handleRatioChange = function (e) {
        //    if (e.keyCode == 13){
        //        //enter
        //        var _ratio = e.target.value;
        //        var ratioValue;
        //        var pos ;
        //        if ((pos = _ratio.search('%'))==-1){
        //            //no %
        //            ratioValue = parseInt(_ratio);
        //
        //        }else{
        //            ratioValue = parseInt(_ratio.splice(pos,1));
        //
        //        }
        //        if (ratioValue>= $scope.ratioRange.min && ratioValue<=$scope.ratioRange.max){
        //            //valid ratio
        //            $scope.viewRatio = '' + ratioValue + '%';
        //
        //        }else {
        //            $scope.viewRatio ='100%';
        //
        //        }
        //
        //    }
        //};

        /**
         * 用来将滚轮的值转换为放大或缩小的比例
         * @param data
         */
        function translateWheelScale(data){
            var scaleNum = parseInt($scope.viewRatio);
            var scaleStr;
            if(data<0){
                if(scaleNum<250){
                    scaleNum=scaleNum+5;
                }
            }else if(data>0){
                if(scaleNum>25){
                    scaleNum=scaleNum-5;
                }
            }
            scaleStr=scaleNum+'%';
            $scope.defaultRatios.splice(10,1,scaleStr);
            $scope.viewRatio=scaleStr;

        }


        $scope.$on('AttributeChanged', function () {
            readDefaultScale();
        });
        $scope.$on('wheelScale',function(event,data){
            translateWheelScale(data);
        })

        $scope.$watch('viewRatio', function () {
            //call view change
            console.log($scope.viewRatio,typeof $scope.viewRatio);
            var type = $scope.isEditingPage? 'page':'subCanvas';
            ViewService.setScale($scope.viewRatio,type);
            $scope.$emit('changeCanvasScale',type);
        });


    }
}]);
