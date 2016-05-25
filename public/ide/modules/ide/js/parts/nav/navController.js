/**
 * Created by shenaolin on 16/2/28.
 */

    ide.controller('NavCtrl', function ($scope, $timeout,
                                        GlobalService,
                                        NavService,
                                        saveProjectModal,
                                        ProjectService,
                                        TemplateProvider,
                                        ProjectFileManage,
                                        Type,
                                        
                                        OperateQueService, TagService, ResourceService, TimerService, $http, ProjectTransformService) {

        initUserInterface();

        $scope.$on('GlobalProjectReceived', function () {


            initProject();
            $scope.$emit('LoadUp');

        });

        /**
         * 初始化Nav界面
         */
        function initUserInterface(){
            $scope.component= {
                nav: {
                    currentNav: -1,
                    navs: [{name: '文件'}
                        , {name: '开始'}
                        , {name: '编辑'}
                        , {name: '格式'}
                        , {name: '视图'}
                        , {name: '帮助'}],
                    changeNav: changeNav
                },

                tool: {
                    toolShow: false,
                    operateQueStatus:OperateQueService.getOperateQueStatus(),
                    deleteStatus:false,
                    sublayerStatus:false,
                    undo:undo,
                    redo:redo,
                    copy:copy,
                    cut:cut,
                    paste:paste,
                    selectAll:selectAll,
                    clearAll:clearAll,
                    addLayer:addLayer,
                    addSubLayer:addSubLayer,
                    deleteObject:deleteObject,
                    addWidget:addWidget,
                    openProject:openProject,
                    generateDataFile:generateDataFile,
                    play:play,
                    closeSimulator:closeSimulator,
                    saveProject:saveProject,
                    showLeft:showLeft,
                    showRight:showRight,
                    showBottom:showBottom
                },
                simulator:{
                    show:false
                }
            };
        }

        function initProject(){
            ProjectService.getProjectTo($scope);
            $scope.project.resourceList = ResourceService.getAllResource()

            $scope.project.customTags = TagService.getAllCustomTags()
            $scope.project.timerTags = TagService.getAllTimerTags()
            $scope.project.timers = TimerService.getTimerNum()

            $scope.$on('NavStatusChanged', onNavStatusChanged);

        }


        function showLeft(){
            $scope.$emit('ChangeShownArea',0);
        }
        function showRight(){
            $scope.$emit('ChangeShownArea',1);
        }
        function showBottom(){
            $scope.$emit('ChangeShownArea',2);
        }
        function saveProject(_saveCb) {
            ProjectService.getProjectTo($scope);


            var projectClone=ProjectService.SaveCurrentOperate();


            ProjectService.changeCurrentPageIndex(0,

                function () {
                    var currentProject= _.cloneDeep($scope.project);
                    var thumb=_.cloneDeep(currentProject.pages[0].url);
                    //console.log(thumb)
                    _.forEach(currentProject.pages,function (_page) {
                    _page.url='';
                    _.forEach(_page.layers,function (_layer) {
                        _layer.url='';
                        _layer.showSubLayer.url='';
                        _.forEach(_layer.subLayers,function (_subLayer) {
                            _subLayer.url='';
                        })

                    })
                    })
                    //console.log(JSON.stringify(currentProject));

                    //if (isOffline){
                    //    return;
                    //}

                    uploadThumb(thumb, function () {
                        $http({
                            method:'PUT',
                            url:'/project/'+currentProject.projectId+'/save',
                            data:{
                                project:currentProject

                            }

                        })
                        .success(function (t) {
                            if (t=='ok'){
                                toastr.info('保存成功');
                                $timeout(function () {

                                    ProjectService.LoadCurrentOperate(projectClone, function () {
                                        $scope.$emit('UpdateProject');
                                        _saveCb && _saveCb();
                                    });

                                })
                            }else{
                                toastr.warning('保存失败')
                                $timeout(function () {

                                    ProjectService.LoadCurrentOperate(projectClone, function () {
                                        $scope.$emit('UpdateProject');
                                    });

                                })
                            }
                        })
                        .error(function (err) {
                            console.log(err);
                            toastr.warning('保存失败');
                            $timeout(function () {
                                ProjectService.LoadCurrentOperate(projectClone, function () {
                                    $scope.$emit('UpdateProject');
                                });
                            })

                        });
                    });
                    function uploadThumb(thumb,_callback){
                        $http({
                            method:'POST',
                            url:'/project/'+currentProject.projectId+'/thumbnail',
                            data:{
                                thumbnail:thumb
                            }
                        })
                        .success(function(r){
                            console.log(r);
                            _callback&&_callback();
                        })
                        .error(function (err) {
                            console.log(err);
                            toastr.warning('上传失败');
                        })
                        //_callback && _callback();
                    }
            });






        }

        /**
         * 改变nav
         * @param index nav序号
         */
        function changeNav(index) {
            if (index!=$scope.component.nav.currentNav){
                $scope.component.nav.currentNav=index;
                $scope.component.tool.toolShow=true;

            }else {
                $scope.component.tool.toolShow=!$scope.component.tool.toolShow;
            }
            $scope.$emit('ChangeToolShow',$scope.component.tool.toolShow);
            $scope.$broadcast('ChangeToolShow',$scope.component.tool.toolShow);
        }

        function onNavStatusChanged(){
            $timeout(function () {
                //更新撤销重做的状态
                $scope.component.tool.operateQueStatus=NavService.getOperateQueStatus();

                //更新删除的状态
                $scope.component.tool.deleteStatus=NavService.getDeleteStatus();

                //更新添加图层的状态
                $scope.component.tool.layerStatus=NavService.getLayerStatus();

                //更新添加Widget的状态
                $scope.component.tool.widgetStatus=NavService.getWidgetStatus();

                $scope.component.tool.copyStatus=NavService.getCopyStatus();

                $scope.component.tool.pasteStatus=NavService.getPasteStatus();

                $scope.component.tool.sublayerStatus=NavService.getSubLayerStatus();
            })
        }

        /**
         * 添加一个Layer
         */
        function addLayer(){
            if (!NavService.getLayerStatus()){
                console.warn('不在对应模式');
                return;
            }

            var oldOperate=ProjectService.SaveCurrentOperate();
            var defaultLayer = TemplateProvider.getDefaultLayer();
            ProjectService.AddNewLayerInCurrentPage(defaultLayer, function () {
                $timeout(function () {
                    $scope.$emit('ChangeCurrentPage', oldOperate);
                })

            });

        }

        function addSubLayer(){
            if (!NavService.getSubLayerStatus()){
                return;
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            var defaultSubLayer = TemplateProvider.getDefaultSubLayer();
            ProjectService.AddNewSubLayerInCurrentLayer(defaultSubLayer, function () {
                $timeout(function () {
                    $scope.$emit('ChangeCurrentPage', oldOperate);
                })
            });


        }
        /**
         * 添加一个Widget
         */
        function addWidget(_index){
            if (!NavService.getWidgetStatus()){
                return;
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            var newWidget=null;
            if (_index==2){
                newWidget = TemplateProvider.getDefaultSlide();
            }
            else if (_index==3){

                newWidget=TemplateProvider.getDefaultProgress();
            }else if(_index==4){
                newWidget = TemplateProvider.getDefaultDashboard();
            }else if (_index==10){

                newWidget=TemplateProvider.getDefaultButton();
            }
            //else if (_index==9){
            //    newWidget=TemplateProvider.getDefaultNumber();}
            else if (_index==13){
                newWidget=TemplateProvider.getDefaultButtonGroup();
            }else if(_index==11){
                newWidget=TemplateProvider.getDefaultKnob();
            }
            else if(_index==9){
                newWidget=TemplateProvider.getDefaultTextArea();
            }
            else if(_index==15){
                newWidget=TemplateProvider.getDefaultNum();
            }
            else if(_index==5){
                newWidget=TemplateProvider.getDefaultOscilloscope();
            }
            else {
                return;
            }
            ProjectService.AddNewWidgetInCurrentSubLayer(newWidget, function () {
                toastr.info('添加Widget成功');
                $timeout(function () {
                    $scope.$emit('ChangeCurrentSubLayer', oldOperate);
                })
            }, function (err) {
            })
        }
        /**
         * 撤销
         */
        function undo(){

            NavService.DoUndo(function () {
                $scope.$emit('Undo');

            })
        }

        /**
         * 重做
         */
        function redo(){
            NavService.DoRedo(function () {
                $scope.$emit('Redo');

            })
        }

        function copy(_callback){

            NavService.DoCopy(function () {
                $scope.$emit('DoCopy');
                _callback&&_callback();

            })
        }


        function cut(){
            copy(function () {
                deleteObject();
            })
        }
        function selectAll(_successCallback){
            ProjectService.OnSelectAll(_successCallback);
        }
        function clearAll(){
            selectAll(function () {
                deleteObject();
            })
        }

        function paste(){
            var oldOperate=ProjectService.SaveCurrentOperate();

            NavService.DoPaste(function () {
                $timeout(function(){
                    $scope.$emit('ChangeCurrentPage',oldOperate);

                })

            })


        }

        function deleteObject(){

            var oldOperate=ProjectService.SaveCurrentOperate();

            NavService.DoDelete(function () {
                $timeout(function(){
                    $scope.$emit('ChangeCurrentPage',oldOperate);

                })

            })
        }

        function openProject(){
            ProjectFileManage.OpenProject(function () {

            })
        }

        /**
         * 生成符合格式的数据结构
         */
        
        function generateDataFile(){
            generateData();
            saveProject(function () {
                $http({
                    method:'POST',
                    url:'/project/'+$scope.project.projectId+'/generate',
                    data:{
                        dataStructure:window.projectData
                    }
                })
                .success(function (data,status,xhr) {
                    if (data == 'ok'){
                        toastr.info('生成成功')
                        //download
                        window.location.href = '/project/'+$scope.project.projectId+'/download'
                    }else{
                        console.log(data);
                        toastr.info('生成失败')
                    }

                })
                .error(function (err,status,xhr) {
                    console.log(err)
                    toastr.info('生成失败')
                })
            })
        }
        
        function generateData(){
            var temp = {};
            ProjectService.getProjectTo(temp);
            temp.project = ProjectTransformService.transDataFile(temp.project);
            temp.project.resourceList = _.cloneDeep(ResourceService.getAllResource());
            temp.project.basicUrl = ResourceService.getResourceUrl();
            //$scope.project.tagList = TagService.getAllCustomTags().concat(TagService.getAllTimerTags());
            temp.project.tagList = TagService.getAllTags();
            temp.project.timers = TimerService.getTimerNum();
            window.projectData = _.cloneDeep(temp.project);

            //$http.post('http://localhost:3000/api/angularproject',$scope.project).success(function (data) {
            //    console.log('success');
            //    console.log(data);
            //}).error(function (err) {
            //    console.log('error');
            //    console.log(err);
            //});
        }

        function play(){
            generateData();
            $scope.component.simulator.show = true;

        }

        function closeSimulator(){

            $scope.component.simulator.show = false;

        }




    });