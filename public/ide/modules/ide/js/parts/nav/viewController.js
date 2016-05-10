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



        $scope.$on('AttributeChanged', function () {
            readDefaultScale();
        });

        $scope.$watch('viewRatio', function () {
            //call view change
            var type = $scope.isEditingPage? 'page':'subCanvas';
            ViewService.setScale($scope.viewRatio,type);
            $scope.$emit('changeCanvasScale',type);
        });


    }
}]);
