/**
 * Created by ChangeCheng on 16/4/1.
 */
ide.controller('ViewCtl', ['$scope', 'ViewService', 'ProjectService', '$uibModal', function ($scope, ViewService, ProjectService, $uibModal) {
    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
    });

    function initUserInterface() {
        $scope.defaultRatios = ['25%', '50%', '75%', '100%', '125%', '150%', '175%', '200%', '225%', '250%'];


        readDefaultScale();

        $scope.ratioRange = {
            min: 25,
            max: 250
        }
    };

    function readDefaultScale() {
        if (ProjectService.isEditingPage()) {
            $scope.isEditingPage = true;
            //page
            $scope.viewRatio = ViewService.getScale('page');
        } else {
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

        /**
         * 用来将滚轮的值转换为放大或缩小的比例
         * @param data
         */
        function translateWheelScale(data) {
            var scaleNum = parseInt($scope.viewRatio);
            var scaleStr;
            if (data < 0) {
                if (scaleNum < 250) {
                    scaleNum = scaleNum + 5;
                }
            } else if (data > 0) {
                if (scaleNum > 25) {
                    scaleNum = scaleNum - 5;
                }
            }
            scaleStr = scaleNum + '%';
            $scope.defaultRatios.splice(10, 1, scaleStr);
            $scope.viewRatio = scaleStr;

        }


        $scope.$on('AttributeChanged', function () {
            readDefaultScale();
        });
        $scope.$on('wheelScale', function (event, data) {
            translateWheelScale(data);
        })

        $scope.$watch('viewRatio', function () {
            //call view change
            var type = $scope.isEditingPage ? 'page' : 'subCanvas';
            ViewService.setScale($scope.viewRatio, type);
            $scope.$emit('changeCanvasScale', type);
        });


        //开启新手引导
        $scope.startTip = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'introModal.html',
                controller: 'introModalCtl',
                scope: $scope,
                size: 'md',
            });

            modalInstance.result.then(function (result) {
                if (result.type === 'intro') {
                    startIntro();
                } else if (result.type === 'newplayer') {
                    startLesson()
                }
            }, function () {

            });

        };


        function startIntro() {
            var intro = new SXIntro()
                .setIntro([{
                    tooltip: '<h4>导航栏</h4><p>1.在文件菜单中可以对工程进行基本操作</p> <p>2.在开始菜单中有基本操作按钮</p><p>3.编辑中有常用辅助操作功能</p>  <p>4.在格式中可以选择字体</p> <p>5.视图能够显示或隐藏侧边栏, 帮助栏中有丰富的资料</p>',
                    position: 'bottom'
                }, {
                    tooltip: '<h4>页面缩略图栏</h4> <p>在这里您可以点击+号新增一个页面</p> <p>也可以通过缩略图选择页面，甚至可以拖动页面进行排序！</p>',
                    position: 'right'
                }, {
                    tooltip: '<h4>舞台区</h4> <p>在这里您的操作将直接反馈并实时显示到这里</p> <p>并且您可以直接和舞台上的元素进行交互。包括拖动，缩放，右键菜单等</p>',
                    position: 'right'
                }, {
                    tooltip: '<h4>功能栏</h4> <p>1.属性栏目可以查看并修改选中元素的属性</p> <p>2.资源栏目可以上传、查看您的资源，包括字体和图片。</p> <p>3.变量栏可以增加、查看、编辑变量和定时器</p><p>4.字体栏为支持字体属性的控件设置字体</p>',
                    position: 'left'
                }, {
                    tooltip: '<h4>层级栏</h4> <p>这里显示了当前页面的层级结构，包括图层控件，子控件等，可以在这里进行快速选择</p>',
                    position: 'left'
                }])
                .start()
        }

        function startLesson() {

        }

    }
}]);


ide.controller('introModalCtl', ['$scope', '$uibModalInstance', 'ProjectService', function ($scope, $uibModalInstance, ProjectService) {
    $scope.mode = 'newPlayer';

    $scope.formats = [
        {
            type: 'newPlayer',
            name: '新手教程',
        }, {
            type: 'intro',
            name: '模块介绍'
        }
    ];

    $scope.ok = function () {
        if ($scope.mode === 'newPlayer') {
            var result = checkEmpty();
            if (true) {
                $uibModalInstance.close({type: $scope.mode});
            } else {
                toastr.error('为了保护您的工程，请使用一个新的空白工程进行新手教程');
            }
        } else {
            $uibModalInstance.close({type: $scope.mode});
        }

    };

    //取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    function checkEmpty() {
        var target = {};
        var pages;
        var layers;
        ProjectService.getProjectCopyTo(target);

        pages = target.project.pages || [];
        layers = pages[0].layers || [];
        if (pages.length !== 1 || layers.length !== 0) {
            return false;
        } else {
            return true;
        }
    }
}]);
