
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
            }
        }
    }

    function showLeft() {
        $scope.$emit('ChangeShownArea', 0);
    }

}]);