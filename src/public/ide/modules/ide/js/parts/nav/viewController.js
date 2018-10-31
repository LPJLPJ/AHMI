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
                } else if (result.type === 'newPlayer') {
                    startLesson()
                }
            }, function () {

            });

        };


        function startIntro() {
            var intro = new SXIntro()
                .setIntro([{
                    tooltip: '<h4>导航栏</h4><p>1.在文件菜单中可以对工程进行基本操作</p> <p>2.在编辑菜单中有基本操作按钮和常用辅助操作功能</p> <p>3.视图栏中能够显示或隐藏侧边栏、调整画布缩放比例</p><p>4.帮助栏中有丰富的资料</p>',
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
            var intro = new SXIntro(null, {flag: 'data-step-c1'})
                .setIntro([{
                    index: 1,
                    tooltip: '<h4>添加画布</h4><p>你好~接下来让我们开始一个简单的DEMO工程</p> <p>1.请点击导航栏上的编辑栏目</p><p>2.请点击开始栏目下的添加画布按钮</p>',
                    position: 'bottom'
                }, {
                    index: 2,
                    tooltip: '<h4>缩放并进入画布</h4><p>现在一个画布出现在了页面上</p> <p>1.拖住画布的右下角并将画布拉伸到合适的大小</p><p>2.请双击，并进入到画布编辑界面</p>',
                    position: 'right'
                }, {
                    index: 3,
                    tooltip: '<h4>添加控件</h4><p>恭喜你进入画布编辑，现在可以添加控件了</p> <p>1.请点击导航栏上的编辑栏目</p><p>2.点击添加控件按钮，并选择按钮控件和仪表盘控件</p>',
                    position: 'bottom'
                }, {
                    index: 4,
                    tooltip: '<h4>摆放控件</h4><p>画布上的控件可以随意拖动</p> <p>1.尝试鼠标选中并按住一个控件</p><p>2.将控件摆放到自己喜欢的位置</p>',
                    position: 'right'
                }, {
                    index: 5,
                    tooltip: '<h4>新建变量</h4><p>接下来，让我添加一个变量</p> <p>1.请点击属性栏上的变量栏目</p><p>2.点击添加新Tag</p><p>3.输入变量名称:速度</p>',
                    position: 'bottom'
                }, {
                    index: 6,
                    tooltip: '<h4>选中控件</h4><p>在层级栏，可以快速的选中某个控件</p> <p>1.请点击NewDashboard以选中仪表盘控件</p>',
                    position: 'left'
                },{
                    index:7,
                    tooltip:'<h4>绑定变量</h4><p>接下来，让我们为这个控件绑定‘速度’变量</p> <p>1.点击属性栏</p><p>2.点击属性栏,并向下滚动，找到‘变量’</p><p>3.点击变量选择器，选中‘速度’变量。此时仪表盘控件已与速度变量相绑定</p>',
                    position:'left'
                },{
                    index:8,
                    tooltip:'<h4>选中按钮控件</h4><p>这一次，我们选择按钮控件</p> <p>1.请点击NewButton以选中按钮控件</p>',
                    position:'left'
                },{
                    index:9,
                    tooltip:'<h4>为按钮控件设定‘动作’</h4><p>在‘动作’中，可以操作‘变量’</p> <p>1.点击属性栏，并向下滚动，找到‘动作列表’</p><p>2.点击‘action0’，出现配置模态框</p><p>3.触发条件选择‘释放’,点击添加指令</p><p>4.操作选择‘+’。操作数1选择‘速度’变量。操作数2值填入1</p><p>5.点击保存</p>',
                    position:'bottom'
                },{
                    index:10,
                    tooltip:'<h4>仿真运行</h4><p>恭喜你已经完成了DEMO的设计，接下来可以模拟运行</p> <p>1.点击编辑栏</p><p>2.点击运行按钮，然后点击运行。会出现仿真页面，接着点击按钮会发现仪表盘指针随之改变。</p>',
                    position:'bottom'
                },{
                    index:11,
                    tooltip:'<h4>生成下载</h4><p>设计完成，可以生成配置包以供烧录至硬件系统</p> <p>1.点击文件栏</p><p>2.点击保存按钮，提示保存生成</p><p>3.点击生成，选择默认，会自动下载一个压缩包，烧录到硬件系统上试试吧~。</p>',
                    position:'bottom'
                }

                ])
                .start()
        }

    }
}]);


ide.controller('introModalCtl', ['$scope', '$uibModalInstance', 'ProjectService', 'TemplateProvider', function ($scope, $uibModalInstance, ProjectService, TemplateProvider) {
    $scope.mode = 'intro';

    $scope.formats = [
        {
            type: 'intro',
            name: '模块介绍'
        },
        {
            type: 'newPlayer',
            name: '新手教程',
        }
    ];

    $scope.ok = function () {
        if ($scope.mode === 'newPlayer') {
            var result = check();
            if (result) {
                $uibModalInstance.close({type: $scope.mode});
            } else {
                toastr.error('请创建一个空白模板工程，并在创建时选中启用模板，以启动新手教程');
            }
        } else {
            $uibModalInstance.close({type: $scope.mode});
        }

    };

    //取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    function check() {
        var target = {};
        var pages;
        var layers;
        var templateId;
        ProjectService.getProjectCopyTo(target);
        templateId = TemplateProvider.getTemplateId();

        pages = target.project.pages || [];
        layers = pages[0].layers || [];
        if (pages.length !== 1 || layers.length !== 0 || !templateId) {
            return false;
        } else {
            return true;
        }
    }
}]);
