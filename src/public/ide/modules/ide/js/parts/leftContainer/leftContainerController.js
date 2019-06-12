
ide.controller('LeftContainerCtrl', ['$scope', '$timeout',function ($scope, $timeout) {

    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        $scope.$emit('LoadUp');

    });

    function initUserInterface() {
        $scope.ui = {
            currentTabIdx:0,
            tabs:["缩略图","导航栏"],
            changeTab:function(idx){
                // $scope.ui.currentTabIdx = -1
                // $timeout(function(){
                //     $scope.ui.currentTabIdx = idx
                // },500)
                $scope.ui.currentTabIdx = idx
            },
            showBottomWidgetPanel:function(){
                $scope.$emit('ChangeShownArea',4)
            }
        }
        $scope.component = {
            out:{
                toolShow:true
            },
            showLeft:showLeft
        }

        $scope.$on('ToolShowChanged', function (event, toolShow) {
            $scope.component.out.toolShow=toolShow;
        });
    }

    function showLeft() {
        $scope.$emit('ChangeShownArea', 0);
    }

}]);