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
                                        CanvasService,
                                        $uibModal,
                                        OperateQueService, TagService, ResourceService, TimerService, $http, ProjectTransformService, RenderSerive, LinkPageWidgetsService) {

        var path, fs, __dirname;
        initLocalPref();
        initUserInterface();
        confirmForClosingWindow();

        $scope.$on('GlobalProjectReceived', function () {


            initProject();
            $scope.$emit('LoadUp');

        });

        $scope.oldWidget={
            name:'',
            coordinate:0,
        }

        /**
         * 初始化Nav界面
         */

        function initLocalPref() {
            if (window.local) {
                path = require('path');
                fs = require('fs');
                __dirname = global.__dirname;
            }
        }

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
                    openPanel:openPanel,
                    closeSimulator:closeSimulator,
                    saveProject: saveProject.bind(null, null, true),
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
            $scope.$on('NavStatusChanged', onNavStatusChanged);

            // setInterval(function () {
            //     saveProject();
            // }.bind(this),5*60*1000)

        }

        //spinner

        function showSpinner() {
            if (window.spinner) {
                window.spinner.setBackgroundColor('rgba(0,0,0,0.5)');
                window.spinner.show();
            }
        }

        function hideSpinner() {
            window.spinner && window.spinner.hide();
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


        //listen for nw.win.close
        function confirmForClosingWindow() {
            if (window.local){
                var win = nw.Window.get();
                var shouldClose = false;
                var closing = false;
                win.on('close',function (e) {
                    if (!closing){
                        closing = true;
                        if (!getSaveStatus()){
                            closing = true;
                            openCloseWindowPanel(function () {
                                //sc
                                saveProject(function () {
                                    //real close
                                    win.close(true);
                                }.bind(this), true)
                            }.bind(this),function () {
                                //fc
                                win.close(true);
                            }.bind(this));
                        }else{
                            win.close(true);
                        }
                    }

                }.bind(this));
            }else {
                window.addEventListener("beforeunload", function(event) {

                    if(!getSaveStatus()){
                        event.returnValue="请确定已保存您的工程";
                    }else{
                        console.log('projects have been saved');
                    }
                });
            }
        }

        function getPlatform() {
            if (window.local){
                return process.platform;
            }else{
                return null;
            }
        }


        /**
         * Scale a dataUrl to target size
         * @param srcDataUrl
         * @param distWidth
         * @param distHeight
         * @param keepRatio
         */
        function scaleImg(srcDataUrl,typeParams,distWidth, distHeight, keepRatio, _cb){
            var tempImg = new Image()
            tempImg.src = srcDataUrl;
            tempImg.onload = function () {
                //draw to offctx
                var originWidth = tempImg.width;
                var originHeight = tempImg.height;
                var offCanvas = CanvasService.getOffCanvas();
                offCanvas.width = distWidth;
                offCanvas.height = distHeight;
                var offCtx = offCanvas.getContext('2d');
                if (!!keepRatio){
                    //keep ratio
                    var hori = originWidth>originHeight;
                    if (hori){
                        var curHeight = originHeight*1.0/originWidth*distWidth;
                        var offsetHeight = (distHeight - curHeight)/2.0;
                        offCtx.drawImage(tempImg,0,offsetHeight,distWidth,curHeight);
                    }else{
                        var curWidth = originWidth*1.0/originHeight*distHeight;
                        var offsetWidth = (distWidth - curWidth)/2.0;
                        offCtx.drawImage(tempImg,offsetWidth,0,curWidth,distHeight);
                    }

                }else{
                    offCtx.drawImage(tempImg,0,0,distWidth,distHeight);
                }
                //get offCtx
                var type = typeParams[0];
                if (type == 'jpeg'){
                    _cb&&_cb(offCanvas.toDataURL('image/jpeg',typeParams[1]||0.8));
                }else{
                    _cb&&_cb(offCanvas.toDataURL('image/png'));
                }

            }

            tempImg.onerror = function(){
                _cb && _cb('');
            }
        }


        function DataUrlToBlob(dataUrl) {
            var arr = dataUrl.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
        }


        function saveProject(_saveCb, useSpinner) {


            // ProjectService.getProjectTo($scope);

            if (useSpinner) {
                showSpinner();
            }
            //edit by lixiang


            var projectClone=ProjectService.SaveCurrentOperate();


            ProjectService.changeCurrentPageIndex(0,

                function () {
                    var curScope = {};
                    ProjectService.getProjectCopyTo(curScope);
                    curScope.project.resourceList = ResourceService.getAllResource();

                    curScope.project.customTags = TagService.getAllCustomTags();
                    curScope.project.timerTags = TagService.getAllTimerTags();
                    curScope.project.timers = TagService.getTimerNum();

                    var currentProject = curScope.project;
                    // console.log(currentProject);
                    var thumb=_.cloneDeep(currentProject.pages[0].url);
                    scaleImg(thumb,['jpeg'],200,200,true, function (scaledThumb) {
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
                        if (window.local) {
                            saveThumb(scaledThumb, function () {
                                //save
                                //save currentProject
                                var projectUrl = ResourceService.getProjectUrl();
                                var dataUrl = path.join(projectUrl, 'project.json');
                                try {
                                    var oldProjectData = JSON.parse(fs.readFileSync(dataUrl));
                                    oldProjectData.thumbnail = path.join(projectUrl, 'thumbnail.jpg');
                                    console.log(oldProjectData.thumbnail);
                                    oldProjectData.content = JSON.stringify(currentProject);
                                    fs.writeFileSync(dataUrl, JSON.stringify(oldProjectData));
                                    //success
                                    toastr.info('保存成功');
                                    ProjectService.LoadCurrentOperate(projectClone, function () {
                                        $scope.$emit('UpdateProject');
                                        _saveCb && _saveCb();
                                    });
                                } catch (e) {
                                    //fail
                                    toastr.warning('保存失败');
                                    ProjectService.LoadCurrentOperate(projectClone, function () {
                                        $scope.$emit('UpdateProject');
                                    });

                                }
                                if (useSpinner) {
                                    hideSpinner();
                                }



                            });
                        } else {
                            uploadThumb(scaledThumb, function () {
                                console.log(currentProject)
                                $http({
                                    method: 'PUT',
                                    url: '/project/' + currentProject.projectId + '/save',
                                    data: {
                                        project: currentProject

                                    }

                                })
                                    .success(function (t) {
                                        if (t == 'ok') {
                                            toastr.info('保存成功');
                                        } else {
                                            toastr.warning('保存失败')
                                        }
                                        if (useSpinner) {
                                            hideSpinner();
                                        }
                                        ProjectService.LoadCurrentOperate(projectClone, function () {
                                            $scope.$emit('UpdateProject');
                                            _saveCb && _saveCb();
                                        });
                                    })
                                    .error(function (err) {
                                        console.log(err);
                                        toastr.warning('保存失败');
                                        if (useSpinner) {
                                            hideSpinner();
                                        }
                                        ProjectService.LoadCurrentOperate(projectClone, function () {
                                            $scope.$emit('UpdateProject');
                                        });

                                    });
                            });
                        }

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

                        function saveThumb(thumb, _callback) {
                            console.log(thumb);
                            var thumbFile = new Buffer(thumb.split(',')[1], 'base64');
                            var projectUrl = $scope.project.projectUrl || path.join(__dirname, 'localproject', currentProject.projectId);
                            var thumbUrl = path.join(projectUrl, 'thumbnail.jpg');
                            try {
                                fs.writeFileSync(thumbUrl, thumbFile);
                                _callback && _callback();
                            } catch (e) {
                                _callback && _callback(e);
                            }

                        }
                    });
                    //console.log(thumb)

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
            if (_index==0){
                newWidget = TemplateProvider.getDefaultSlide();
            }
            else if (_index==2){

                newWidget=TemplateProvider.getDefaultProgress();
            }else if(_index==3){
                newWidget = TemplateProvider.getDefaultDashboard();
            } else if (_index == 8) {

                newWidget=TemplateProvider.getDefaultButton();
            }
            //else if (_index==9){
            //    newWidget=TemplateProvider.getDefaultNumber();}
            else if (_index == 10) {
                newWidget=TemplateProvider.getDefaultButtonGroup();
            }
            // else if(_index==10){
            //     newWidget=TemplateProvider.getDefaultKnob();
            // }
            else if (_index == 7) {
                newWidget=TemplateProvider.getDefaultTextArea();
            }
            else if (_index == 6) {
                newWidget=TemplateProvider.getDefaultNum();
            }
            // else if(_index==4){
            //     newWidget=TemplateProvider.getDefaultOscilloscope();
            // }
            else if (_index == 1) {
                newWidget=TemplateProvider.getDefaultSwitch();
            } else if (_index == 4) {
                newWidget=TemplateProvider.getDefaultRotateImg();
            }
            else if (_index == 5) {
                newWidget=TemplateProvider.getDefaultDateTime();
            } else if (_index == 11) {
                newWidget=TemplateProvider.getDefaultScriptTrigger();
            } else if (_index == 9) {
                newWidget=TemplateProvider.getDefaultSlideBlock();
            }
            else {
                return;
            }
            if(newWidget.name==$scope.oldWidget.name){
                $scope.oldWidget.coordinate+=20;
                newWidget.info.left=$scope.oldWidget.coordinate;
                newWidget.info.top=$scope.oldWidget.coordinate;
            }else{
                $scope.oldWidget.name=newWidget.name;
                $scope.oldWidget.coordinate = 0;
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

        function generateDataFile(format){
            generateData(format);
            if (window.local){
                if (window.spinner){
                    window.spinner.setBackgroundColor('rgba(0,0,0,0.5)');
                    window.spinner.show();
                }
                RenderSerive.renderProject(window.projectData,function () {
                    toastr.info('生成成功');
                    window.spinner&&window.spinner.hide();
                },function () {
                    toastr.info('生成失败');
                    window.spinner&&window.spinner.hide();
                });
            }else{
                saveProject(function () {
                    showSpinner();
                    $http({
                        method:'POST',
                        url:'/project/'+$scope.project.projectId+'/generate',
                        data:{
                            dataStructure:window.projectData
                        }
                    })
                        .success(function (data,status,xhr) {
                            hideSpinner();
                            if (data == 'ok'){
                                toastr.info('生成成功');
                                //download
                                window.location.href = '/project/'+$scope.project.projectId+'/download'
                            }else{
                                console.log(data);
                                toastr.info('生成失败')
                            }


                        })
                        .error(function (err,status,xhr) {
                            hideSpinner();
                            console.log(err);
                            toastr.info('生成失败')

                        })
                })
            }

        }

        function generateData(format){
            var temp = {};
            ProjectService.getProjectCopyTo(temp);
            temp.project = ProjectTransformService.transDataFile(temp.project);
            temp.project.format = format;
            temp.project.resourceList = _.cloneDeep(ResourceService.getAllResource());
            temp.project.basicUrl = ResourceService.getResourceUrl();
            //$scope.project.tagList = TagService.getAllCustomTags().concat(TagService.getAllTimerTags());
            temp.project.tagList = TagService.getAllTags();
            temp.project.timers = TagService.getTimerNum();
            //link widgets
            for (var i = 0; i < temp.project.pageList.length; i++) {
                LinkPageWidgetsService.linkPageAllWidgets(temp.project.pageList[i]);
            }
            window.projectData = temp.project;

        }


        function play(){
            generateData()
            window.cachedResourceList = _.cloneDeep(ResourceService.getGlobalResources());

            $scope.component.simulator.show = true;

        }

        function closeSimulator(){

            $scope.component.simulator.show = false;

        }


        //modal for closing window
        function openCloseWindowPanel(sc,fc) {


            /**
             * 利用$uiModal服务，制作模态窗口
             */
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'navModalCloseWindow.html',
                controller: 'NavModalCloseWindwoCtl',
                size: 'md',
                backdrop:'static',
                resolve: {

                }
            });

            /**
             * result.then接收两个匿名函数参数
             * calling $uibModalInstance.close will trigger the former function
             * when clicking at the background, pressing the esc button on keyboard, or calling $modalInstance.dismiss will trigger the latter one
             */
            modalInstance.result.then(function (result) {
                //save
                sc && sc();
            }, function () {
                fc && fc();
            });
        }


        function openPanel() {


            /**
             * 利用$uiModal服务，制作模态窗口
             */
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'navModal.html',
                controller: 'NavModalCtl',
                size: 'md',
                resolve: {

                }
            });

            /**
             * result.then接收两个匿名函数参数
             * calling $uibModalInstance.close will trigger the former function
             * when clicking at the background, pressing the esc button on keyboard, or calling $modalInstance.dismiss will trigger the latter one
             */
            modalInstance.result.then(function (result) {
                // console.log('new action');
                // console.log(newAction);
                //process save
                generateDataFile(result.format);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        function getSaveStatus(){
            var status = false;//未save
            if(document.getElementById("saveFlag").value==="true"){
                status=true;
            }
            return status;
        }






    });


ide.controller('NavModalCtl',['$scope','$uibModalInstance',function ($scope,$uibModalInstance) {
    $scope.formats = [
        {
            type:'normal',
            name:'默认'
        },
        {
            type:'dxt3',
            name:'压缩'
        }
    ];
    $scope.generateFormat = 'normal';
    $scope.ok = function () {
        $uibModalInstance.close({
            format:$scope.generateFormat
        });
    };

    //取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);


ide.controller('NavModalCloseWindwoCtl',['$scope','$uibModalInstance',function ($scope,$uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    //取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);