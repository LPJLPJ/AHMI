
ide.controller('ThumbCtrl', ['$scope', '$timeout',
    'ProjectService',
    'GlobalService',
    'TemplateProvider',
    'OperateQueService',function ($scope, $timeout,
                                      ProjectService,
                                      GlobalService,
                                      TemplateProvider,
                                      OperateQueService) {


    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();
        initProject();
        $scope.$emit('LoadUp');
        // window.thumbScope = $scope;
        // window.thumbUpdate = updateThumbImgs;
    });

    function initUserInterface() {
        $scope.component = {
            addPage: null,
            uitree: null,
            menuOptions:[],
            allContextMenus:[],
            out:{
                toolShow:false
            }
        }
    }



    function initProject() {

        $scope.component.allContextMenus=[
            ['复制', function ($itemScope) {
                var selectIndex=$itemScope.$parent.$index;
                copyPageByIndex(selectIndex)
            }],
            ['删除', function ($itemScope) {
                var selectIndex=$itemScope.$parent.$index;
                deletePageByIndex(selectIndex);
            },
                function ($itemScope) {
                    return true;
                }
            ],
            ['粘贴',function ($itemScope) {
                pastePageByIndex();
            }]
        ];

        $scope.component.menuOptions = [
            $scope.component.allContextMenus[0],
            null,
            $scope.component.allContextMenus[1]
        ];
        ProjectService.getProjectTo($scope);
        $scope.component.addPage = createNewPage;
        $scope.component.selectThumb = selectThumb;
        $scope.component.uitree = ProjectService.BindPageTree(
            function (e) {
                selectThumb($scope.project.pages[e.source.index]);
            },
            function (e,oldOperate) {
                selectThumb($scope.project.pages[e.dest.index],function(){
                    $scope.$emit('ChangeCurrentPage',oldOperate)
                });

            }
        );
        $scope.$on('PageNodeChanged', function () {
            updateThumbImgs();
        });

        $scope.$on('ToolShowChanged', function (event, toolShow) {
            $scope.component.out.toolShow=toolShow;
        });

        $scope.$on('ProjectUpdated', function () {
            ProjectService.getProjectTo($scope);
        })
    }


    /**
     * 更新预览图
     */
    function updateThumbImgs() {

        $timeout(function () {
            ProjectService.getProjectTo($scope);

        })

    }

    function deletePageByIndex(_index){
        var oldOperate=ProjectService.SaveCurrentOperate();

        $timeout(function () {
            ProjectService.DeletePageByIndex(_index, function () {
                $scope.$emit('SwitchCurrentPage', oldOperate, function () {
                });

            });
        })
    }

    function copyPageByIndex(_index){
        //console.log('复制的是'+_index);
        $timeout(function () {
            ProjectService.CopyPageByIndex(_index, function () {
                updateShearPlate();
                $scope.$emit('ChangeCurrentPage');
            });
        })
    }


    function pastePageByIndex(){
        if (ProjectService.isRendering()){
            console.warn('粘贴被拒绝');
            return;
        }
        var oldOperate=ProjectService.SaveCurrentOperate();
        $timeout(function () {
            ProjectService.PastePageByIndex(function(){
                updateShearPlate();
                $scope.$emit('AddNewPage', oldOperate, function () {

                });
            })
        });



    }

    function updateShearPlate(){
        var pasteEnable=ProjectService.shearPagePlateEnable();
        if (pasteEnable){
            $scope.component.menuOptions = [
                $scope.component.allContextMenus[0],
                null,
                $scope.component.allContextMenus[2],
                null,
                $scope.component.allContextMenus[1]
            ];
        }else {
            $scope.component.menuOptions = [
                $scope.component.allContextMenus[0],
                null,
                $scope.component.allContextMenus[1]
            ];
        }
    }


    /**
     * 创建新页面
     */
    function createNewPage() {
        if (ProjectService.isRendering()){
            console.warn('创建被拒绝');
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();
        //TODO:测试时生成随机页
        var randomPage = TemplateProvider.getDefaultPage();

        ProjectService.AddNewPage(randomPage, function () {
            $scope.$emit('AddNewPage', oldOperate, function () {

            });
        })


    }

    function selectThumb(page) {
        if (!page||!page.id){
            return;
        }
        for (var i=0;i<$scope.project.pages.length;i++){

            if ($scope.project.pages[i].id
                ==page.id){
                ProjectService.changeCurrentPageIndex(i, function (keepInSamePage) {
                    var oldOperate=ProjectService.SaveCurrentOperate();

                    if (!keepInSamePage){

                        $scope.$emit('SwitchCurrentPage');


                    }else{
                        $scope.$emit('ChangeCurrentPage',oldOperate, function () {
                        });
                    }

                });
                break;
            }
        }
    }
}]);