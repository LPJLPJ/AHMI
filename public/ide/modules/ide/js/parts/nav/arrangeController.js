/**
 * Created by lixiang on 16/3/28.
 */
ide.
    controller('arrangeCtr',function($scope,ProjectService){
        $scope.changeZIndex=function(_op){
            var option={
                index:_op
            };
            ProjectService.ChangeAttributeZIndex(option);
        }
    });