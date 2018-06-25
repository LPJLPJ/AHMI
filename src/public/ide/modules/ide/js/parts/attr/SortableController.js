/**
 * Created by YangZitao on 2016/12/14.
 */
ide.controller("sortCtrl",['$scope','$timeout',function($scope,$timeout){
    $scope.cannotSort = false;
        $scope.sortableOptions = {
            // 数据有变化
            update: function(e, ui) {
                console.log("update");
                //需要使用延时方法，否则会输出原始数据的顺序，可能是BUG？
                $timeout(function() {
                    var resArr = [];
                    for (var i = 0; i < $scope.data.length; i++) {
                        resArr.push($scope.data[i].i);
                    }
                    console.log(resArr);
                })


            },

            // 完成拖拽动作
            stop: function(e, ui) {
                //do nothing
            }
        }
    }])