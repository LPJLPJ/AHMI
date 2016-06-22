/**
 * Created by ChangeCheng on 16/4/5.
 */

ide.controller('ContainerCtl', ['$scope', 'KeydownService', 'NavService', 'ProjectService', '$document', function ($scope, KeydownService, NavService, ProjectService, $document) {
    $scope.$on('GlobalProjectReceived', function () {


        initInterface();
        initListeningKeyDown();
        $scope.$emit('LoadUp');
    });

    function initInterface() {
        // var container = angular.element('.container-fluid')[0];
        // console.log(container);
        // $document.bind('scroll',function (e) {
        //     console.log(e);
        //     e.preventDefault();
        //     e.stopPropagation();
        // })
    }

    function initListeningKeyDown(){
        $scope.handleKeyUp = function (e) {
            KeydownService.keyUp();
        };

        $scope.handleKeyDown = function (e) {

            var currentKey = KeydownService.currentKeydown(e);
            if(_.indexOf(KeydownService.getActionKeys(),currentKey)>=0){
                //如果点击的键是热键,则屏蔽浏览器的默认按键
                e.preventDefault();

            }
            //console.log(KeydownService.isCtrlPressed());
            if (KeydownService.isValidKeyPair(currentKey)){
                //emit
                //$scope.$emit('ActionKeyPressed',currentKey);
                switch (currentKey){
                    case 'Cmd-C':
                    case 'Ctrl-C':
                        NavService.DoCopy(function () {
                            $scope.$emit('DoCopy');

                        });
                        break;
                    case 'Cmd-V':
                    case 'Ctrl-V':
                        var oldOperate=ProjectService.SaveCurrentOperate();

                        NavService.DoPaste(function () {
                            $scope.$emit('ChangeCurrentPage',oldOperate);

                        });
                        break;

                    case 'Cmd-BackSpace':
                    case 'Ctrl-BackSpace':
                    case 'Cmd-Delete':
                    case 'Ctrl-Delete':
                        console.log('删除');

                        var oldOperate=ProjectService.SaveCurrentOperate();

                        NavService.DoDelete(function () {
                            $scope.$emit('ChangeCurrentPage',oldOperate);

                        })
                        break;

                    case 'Ctrl-Z':
                        console.log('撤销');
                        break;

                }
            }
        }
    }

}]);