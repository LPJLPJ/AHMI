/**
 * Created by ChangeCheng on 16/4/5.
 */

ide.controller('ContainerCtl', ['$scope', 'KeydownService', 'NavService', 'ProjectService', '$document', function ($scope, KeydownService, NavService, ProjectService, $document,ViewService) {
    $scope.$on('GlobalProjectReceived', function () {


        initInterface();
        initListeningKeyDown();
        initListeningMouseWheel();
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

    function initListeningMouseWheel() {
        var supportPassive=false;
        try{
            var opts = Object.defineProperties({},'passive',{
                get:function(){
                    supportPassive = true;
                }
            });
        }catch(e){

        };
        var target = document.getElementsByClassName('container-fluid')[0];
        target.addEventListener('wheel',function (e) {
            //console.log($scope.currentKey)
            if ($scope.currentKey === 'Shift-'||$scope.currentKey==='Ctrl-'){
                e.preventDefault();
                /**handle mousewheel event */
                if(parseInt(e.delatY)!==0){
                    $scope.$broadcast('wheelScale',parseInt(e.deltaY));
                }
            }
        },supportPassive? {passive: true} : false);
    }

    function initListeningKeyDown(){
        $scope.handleKeyUp = function (e) {
            KeydownService.keyUp();
            $scope.currentKey = '';
        };

        $scope.handleKeyDown = function (e) {
            var currentKey = KeydownService.currentKeydown(e);
            $scope.currentKey = currentKey;
            //console.log('this is current keyStr',currentKey);
            if(_.indexOf(KeydownService.getActionKeys(),currentKey)>=0){
                //如果点击的键是热键,则屏蔽浏览器的默认按键
                e.preventDefault();

            }
            //console.log(KeydownService.isCtrlPressed());
            if (KeydownService.isValidKeyPair(currentKey)){
                console.log('currentKey',currentKey,e);

                // console.log(currentKey)
                //emit
                //$scope.$emit('ActionKeyPressed',currentKey);
                switch (currentKey){
                    case 'Cmd-C':
                    case 'Ctrl-C':
                        NavService.DoCopy(function () {
                            $scope.$emit('DoCopy');

                        });
                        break;
                    case 'Cmd-X':
                    case 'Ctrl-X':
                        NavService.DoCopy(function(){
                            $scope.$emit('DoCopy');
                            var oldOperate = ProjectService.SaveCurrentOperate();
                            NavService.DoDelete(function () {
                                $scope.$emit('ChangeCurrentPage', oldOperate);
                            })
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
                    case 'Ctrl-S':
                    case 'Cmd-S':
                        e.preventDefault();
                        NavService.DoSave();
                    break;

                    case 'Ctrl-Z':
                        console.log('撤销');
                        var oldOperate=ProjectService.SaveCurrentOperate();

                        NavService.DoUndo(function () {
                            $scope.$emit('ChangeCurrentPage',oldOperate);

                        });
                        break;
                    case 'Ctrl-Up':
                    case 'Ctrl-Down':
                    case 'Ctrl-Left':
                    case 'Ctrl-Right':
                    case 'Shift-Up':
                    case 'Shift-Down':
                    case 'Shift-Left':
                    case 'Shift-Right':
                        var oldOperate=ProjectService.SaveCurrentOperate();
                        // console.log('shifting')
                        var keys = currentKey.toLowerCase().split('-');
                        var orientation = keys[keys.length-1];
                        NavService.DoMove(orientation, 1, function () {
                            // console.log('shifted')
                            $scope.$emit('ChangeCurrentPage',oldOperate);

                        }.bind(this));
                        break;

                }
            }
        }
    }

}]);