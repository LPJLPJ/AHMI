/**
 * Created by lixiang on 16/3/28.
 */
ide.
    controller('arrangeCtr',['$scope','ProjectService',function($scope,ProjectService){
        $scope.changeZIndex=function(_op){
            var option={
                index:_op
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeZIndex(option,function () {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                    ProjectService.updateCurrentThumbInPage();

                });
        }

        $scope.changeGroupAlign = function(alignModeId){
            var option = {
                align: alignModeId
            };
            // var oldOperate = ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeGroupAlign(option);
        }
    }]);