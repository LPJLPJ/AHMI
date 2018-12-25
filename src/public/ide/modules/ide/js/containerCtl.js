/**
 * Created by ChangeCheng on 16/4/5.
 */

ide.controller('ContainerCtl', ['$scope', 'KeydownService', 'NavService', 'ProjectService', '$document', function ($scope, KeydownService, NavService, ProjectService, $document,ViewService) {
    $scope.$on('GlobalProjectReceived', function () {


        initHelpPrompt();
        initListeningKeyDown();
        initListeningMouseWheel();
        $scope.$emit('LoadUp');
    });

    function initHelpPrompt() {
        $scope.helpDocs = {
            menu:{
                "文件":'cai_dan_lan.html#文件',
                "编辑":'cai_dan_lan.html#编辑',
                "视图":'cai_dan_lan.html#视图',
                "帮助":'cai_dan_lan.html#帮助'
            },
            widget:{
                "图层":'tu_ceng.html',
                "开关":'kai_guan.html',
                "进度条":'jin_du_tiao.html',
                "仪表盘":'yi_biao_pan.html',
                "旋转图":'xuan_zhuan_tu.html',
                "时间":'shi_jian.html',
                "数字":'shu_zi.html',
                "文本":'wen_ben_kuang.html',
                "按钮":'an_niu.html',
                "滑块":'hua_kuai.html',
                "按钮组":'an_niu_zu.html',
                "触发器":'hong_fa_qi.html',
                "影像":'shi_pin.html',
                "开机动画":'kai-ji-dong-hua.html',
                "图层数字":'tu-ceng-shu-zi-kong-jian.html',
                "图层时间":'tu-ceng-shi-jian-kong-jian.html',
                "触摸追踪":'hong-mo-zhui-zong.html',
                "透明度图层":'tou-ming-du-tu-ceng.html',
                "文本输入":'wen-ben-shu-ru.html'
            },
            attr:{
                "属性":'shu_xing_lan.html#属性',
                "资源":'shu_xing_lan.html#资源',
                "变量":'shu_xing_lan.html#变量',
                "字体":'shu_xing_lan.html#字体'
            },
            thumb:{
                "thumb":'ye_mian_lie_biao.html'
            },
            animate:{
                "animate":'gao-jie-she-ji-liu-cheng/dong-hua.html'
            }
        };

        $scope.openHelp = function(e,classify,key){
            e.stopPropagation();
            var docUrl = 'https://docs.graphichina.com/'+$scope.helpDocs[classify][key];
            window.open(docUrl);
        }
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