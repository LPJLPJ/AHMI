/**
 * Created by lixiang on 16/3/28.
 */
ide.
    controller('arrangeCtr',function($scope,ProjectService){
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
    });