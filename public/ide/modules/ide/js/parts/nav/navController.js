

    ide.controller('NavCtrl', ['$scope', '$timeout',
        'GlobalService',
        'NavService',
        'saveProjectModal',
        'ProjectService',
        'TemplateProvider',
        'ProjectFileManage',
        'Type',
        'CanvasService',
        '$uibModal',
        'OperateQueService', 'TagService', 'ResourceService', 'TimerService', '$http', 'ProjectTransformService', 'RenderSerive', 'LinkPageWidgetsService','NavModalCANConfigService',function ($scope, $timeout,
                                        GlobalService,
                                        NavService,
                                        saveProjectModal,
                                        ProjectService,
                                        TemplateProvider,
                                        ProjectFileManage,
                                        Type,
                                        CanvasService,
                                        $uibModal,
                                        OperateQueService, TagService, ResourceService, TimerService, $http, ProjectTransformService, RenderSerive, LinkPageWidgetsService,NavModalCANConfigService) {

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
                    openCANPanel:openCANPanel,
                    runSimulator:runSimulator,
                    closeSimulator:closeSimulator,
                    saveProject: saveProject.bind(null, null, true),
                    saveProjectAs:saveProjectAs,
                    showLeft:showLeft,
                    showRight:showRight,
                    showBottom:showBottom,
                    rotateCanvasLeft:rotateCanvasLeft,
                    rotateCanvasRight:rotateCanvasRight
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
        function rotateCanvasLeft(){
            var c = document.getElementById('c');
            var backgroundCanvas = document.getElementById('backgroundCanvas');
            var c1 = document.getElementById('c1');
            c.style.cssText="transform:rotate(270deg);left:0;top:0";
            backgroundCanvas.style.cssText="transform:rotate(270deg);left:0;top:0";
            c1.style.cssText="transform:rotate(270deg);left:0;top:0";
            //var cNode = CanvasService.getPageNode();
            //var c1Node = CanvasService.getSubLayerNode();
            //cNode.deactivateAll();
            //c1Node.deactivateAll();
            //var cArr=cNode.getObjects();
            //var c1Arr=c1Node.getObjects();
            //cArr.map(function(obj){
            //    obj['selectable']=false;
            //});
            //c1Arr.map(function(obj){
            //    obj['selectable']=false;
            //});
        }
        function rotateCanvasRight(){
            var c = document.getElementById('c');
            var backgroundCanvas = document.getElementById('backgroundCanvas');
            var c1 = document.getElementById('c1');
            c.style.cssText="transform:rotate(0deg);left:0;top:0";
            backgroundCanvas.style.cssText="transform:rotate(0deg);left:0;top:0";
            c1.style.cssText="transform:rotate(0deg);left:0;top:0";
            //var cNode = CanvasService.getPageNode();
            //var c1Node = CanvasService.getSubLayerNode();
            //cNode.deactivateAll();
            //c1Node.deactivateAll();
            //var cArr=cNode.getObjects();
            //var c1Arr=c1Node.getObjects();
            //cArr.map(function(obj){
            //    obj['selectable']=true;
            //});
            //c1Arr.map(function(obj){
            //    obj['selectable']=true;
            //});
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
            //console.log('save arguments',arguments);
            if (useSpinner) {
                showSpinner();
            }
            var projectClone=ProjectService.SaveCurrentOperate();
            ProjectService.changeCurrentPageIndex(0,

                function () {
                    var curScope = {};
                    ProjectService.getProjectCopyTo(curScope);
                    curScope.project.resourceList = ResourceService.getAllResource();

                    curScope.project.customTags = TagService.getAllCustomTags();
                    curScope.project.timerTags = TagService.getAllTimerTags();
                    curScope.project.timers = TagService.getTimerNum();
                    curScope.project.version = window.ideVersion;
                    curScope.project.CANId = NavModalCANConfigService.getCANId();
                    var currentProject = curScope.project;
                    console.log('currentProject',currentProject);
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
                        });
                        if (window.local) {
                            saveThumb(scaledThumb, function () {
                                //save
                                //save currentProject
                                var projectUrl = ResourceService.getProjectUrl();
                                var dataUrl = path.join(projectUrl, 'project.json');
                                try {
                                    var oldProjectData = JSON.parse(fs.readFileSync(dataUrl));
                                    oldProjectData.thumbnail = path.join(projectUrl, 'thumbnail.jpg');
                                    // console.log(oldProjectData.thumbnail);
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
                                // console.log(currentProject)
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
                                });
                            //_callback && _callback();
                        }

                        function saveThumb(thumb, _callback) {
                            // console.log(thumb);
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

        function saveProjectAs(){
            var projectId = ProjectService.getProjectId();
            if(window.local){
                //for local
            }else{
                var modalInstance = $uibModal.open({
                    animation:$scope.animationsEnabled,
                    templateUrl:'saveAsModal.html',
                    controller:'NavModalSaveAsCtrl',
                    size:'md',
                    resolve:{
                    }
                });
                modalInstance.result.then(function(result){
                    //console.log('result',result);
                    showSpinner();
                    $http({
                        method:'POST',
                        url:'/project/'+projectId+'/saveAs',
                        data:result
                    })
                        .success(function(data){
                            console.log('data',data);
                            if(data=='ok'){
                                hideSpinner();
                                toastr.info('另存为成功');
                                if(window.opener){
                                    window.opener.location.reload();
                                }
                            }
                        })
                        .error(function(err){
                            console.log(err);
                            toastr.info('另存为失败');
                            hideSpinner();
                        })

                },function(str){
                    //console.log(str);
                })
            }
        };

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
            } else if(_index == 12){
                newWidget=TemplateProvider.getDefaultVideo();
            } else if(_index == 13){
                newWidget = TemplateProvider.getDefaultAnimation();
            }else if (_index == 13){
                newWidget = TemplateProvider.getDefaultGeneral()
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
            if(format=='local'){
                
                //console.log('keke',format);
                var curScope = {};
                ProjectService.getProjectCopyTo(curScope);
                curScope.project.resourceList = ResourceService.getAllResource();

                curScope.project.customTags = TagService.getAllCustomTags();
                curScope.project.timerTags = TagService.getAllTimerTags();
                curScope.project.timers = TagService.getTimerNum();
                curScope.project.version = window.ideVersion;
                curScope.project.CANId = NavModalCANConfigService.getCANId();
                var currentProject = curScope.project;
                //saveProject(function(){
                    if (window.spinner){
                        window.spinner.setBackgroundColor('rgba(0,0,0,0.5)');
                        window.spinner.show();
                    }
                    $http({
                        method:'POST',
                        url:'/project/'+$scope.project.projectId+'/generateLocalProject'
                        //data:{currentProject:currentProject}
                    })
                    .success(function(data,status,xhr){
                        //console.log(data);
                        window.spinner&&window.spinner.hide();
                        if(data=='ok'){
                            toastr.info('生成本地版成功');
                            window.location.href = '/project/'+$scope.project.projectId+'/downloadLocalProject'
                        }else{
                            toastr.error('生成失败')
                        }
                    })
                    .error(function(err,status,xhr){
                        console.log(err);
                    })
                //})
            }else{
                generateData(format);
                if (window){
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
            temp.project.CANId = NavModalCANConfigService.getCANId();
            //link widgets
            for (var i = 0; i < temp.project.pageList.length; i++) {
                LinkPageWidgetsService.linkPageAllWidgets(temp.project.pageList[i]);
            }
            window.projectData = temp.project;

        }


        function play(){
            generateData()
            window.cachedResourceList = ResourceService.getGlobalResources();

            $scope.component.simulator.show = true;

        }

        function closeSimulator(){

            $scope.component.simulator.show = false;

        }
        
        function runSimulator() {
            // console.log(window.runSimulator);
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
                resolve: {}
            });

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


        /**
         * 打开CAN配置模态框
         * @return {[type]} [description]
         */
        function openCANPanel(){
            var CANInfo;
            if(window.local){
                var CANProjects = readLocalProjects('CAN').map(function(raw){
                    return JSON.parse(raw);
                });
                var CANInfo = CANProjects.map(function(obj){
                    return {
                        name:obj.name,
                        id:obj._id
                    }
                })
                //console.log('CANProject',CANInfo);
                var modalInstance = $uibModal.open({
                        animation:$scope.animationsEnabled,
                        templateUrl:'navCANModal.html',
                        controller:'NavModalCANConfig',
                        size:'md',
                        resolve:{
                            data:function(){
                                return CANInfo;
                            }
                        }
                    });
                modalInstance.result.then(function(result){
                    if(result){
                        var targetPro = null;
                        for(var i=0;i<CANProjects.length;i++){
                            if(CANProjects[i]._id==result){
                                targetPro=JSON.parse(CANProjects[i].content);
                                break;
                            }
                        }
                        if(targetPro){
                            importCANConfig(result,targetPro);
                        }else{
                            toastr.error('导入失败');
                        }
                    }else{
                        deleteCANConfig();
                    }
                },function(){})
            }else{
                $http({
                    method:'GET',
                    url:'/CANProject/names'
                })
                .success(function(data,status,xhr){
                    //console.log('data',data);
                    CANInfo = data;
                    var modalInstance = $uibModal.open({
                        animation:$scope.animationsEnabled,
                        templateUrl:'navCANModal.html',
                        controller:'NavModalCANConfig',
                        size:'md',
                        resolve:{
                            data:function(){
                                return CANInfo;
                            }
                        }
                    });

                    modalInstance.result.then(function(result){
                        //console.log('result',result);
                        if(result){
                            importCANConfig(result);
                        }else{
                            deleteCANConfig();
                        }
                    },function(){
                    })
                })
                .error(function(err){
                    console.log('err',err);
                    toastr.warning('获取失败');
                });
            } 
        }

        /**
         * 读取本地CAN工程文件
         * @param  {string} projectType 文件类型
         * @return {arr}             文件数组
         */
        function readLocalProjects(projectType) {
            var dir;
            var fileName;
            var localCANProjectDir = path.join(__dirname,'localproject','localCANProject');

            switch(projectType){
                case 'CAN':
                    dir = localCANProjectDir;
                    fileName ='CANProject.json';
                    break;
                case 'normal':
                default:
                    dir = localProjectDir;
                    fileName = 'project.json';
                    break;
            }

            // console.log('dir',dir);
            var projects=[];
            try {
                var stats = fs.statSync(dir);
                if (stats&&stats.isDirectory()){
                    var projectNames = fs.readdirSync(dir);
                    for (var i=0;i<projectNames.length;i++){
                        var curProjectDir =  path.join(dir,projectNames[i]);
                        var curProject = readSingleFile(path.join(curProjectDir,fileName),true);
                        if (curProject){
                            projects.push(curProject);
                        }
                    }
                }
            }catch (err){

            }

            return projects;
        }

        /**
         * 读取一个文件
         * @param  {[type]} filePath [description]
         * @param  {[type]} check    [description]
         * @return {[type]}          [description]
         */
        function readSingleFile(filePath,check) {
            if (check){
                try{
                    var stats = fs.statSync(filePath);
                    if (stats&&stats.isFile()){
                        return fs.readFileSync(filePath,'utf-8');
                    }else{
                        return null;
                    }
                }catch (e){
                    return null;
                }


            }else{
                return fs.readFileSync(filePath,'utf-8');
            }
        }

        /**
         * 导入CAN配置
         * @param  {[type]} id [CAN]
         * @return {[type]}    [description]
         */
        function importCANConfig(id,pro){
            if(window.local){
                var localProjectResourcesDir = path.join(__dirname,'localproject',$scope.project.projectId,'resources');
                try{
                    var stats = fs.statSync(localProjectResourcesDir);
                    if(stats.isDirectory()){
                        var dataUrl = path.join(localProjectResourcesDir,'CANFile.json');
                        fs.writeFileSync(dataUrl,JSON.stringify(pro,null,4));
                        toastr.info('导入成功');
                    }else{
                        toastr.error('导入失败');
                    }
                }catch(e){
                    toastr.error('导入失败');
                }
            }else{
                $http({
                    method:'POST',
                    url:'/CANProject/'+id+'/importCANFile',
                    data:{
                        projectId:$scope.project.projectId
                    }
                })
                .success(function(data,status,xhr){
                    if(data=='ok'){
                        toastr.info('导入成功');
                    }
                })
                .error(function(data,status,xhr){
                    toastr.error('导入失败');
                    console.log('导入失败',data);
                });
            }
        }

        /**
         * 删除CAN配置
         * @return {[type]} [description]
         */
        function deleteCANConfig(){
            if(window.local){
                var localProjectResourcesDir = path.join(__dirname,'localproject',$scope.project.projectId,'resources');
                 try{
                    var stats = fs.statSync(localProjectResourcesDir);
                    if(stats.isDirectory()){
                        var dataUrl = path.join(localProjectResourcesDir,'CANFile.json');
                        fs.unlink(dataUrl,function(err){
                            if(err){
                                toastr.error('取消失败')
                            }else{
                                toastr.info('取消CAN配置');
                            }
                        });
                        
                    }else{
                        toastr.error('取消失败');
                    }
                }catch(e){
                    toastr.error('取消失败');
                }
            }else{
                $http({
                    method:'POST',
                    url:'/CANProject/'+$scope.project.projectId+'/deleteCANFile',
                    data:{}
                })
                .success(function(data,status,xhr){
                    if(data=='ok'){
                        toastr.info('取消CAN配置')
                    }
                })
                .error(function(data,status,xhr){
                    console.log('删除失败',data);
                }) 
            }
        }
    }]);



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
    var localFormat = {
        type:'local',
        name:'本地'
    }
    if(!window.local){
        $scope.formats[2] = localFormat;
    };
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

/**
 * CAN模态框控制器
 * @return {[type]}
 */
ide.controller('NavModalCANConfig',['$scope','$uibModalInstance','data','NavModalCANConfigService',function($scope,$uibModalInstance,data,NavModalCANConfigService){
    $scope.CANInfo = data;
    $scope.selectCANId = NavModalCANConfigService.getCANId();
    $scope.ok = function(){
        if(($scope.selectCANId==null)&&(NavModalCANConfigService.getCANId()==null)){
            //console.log('未改变');
            $uibModalInstance.dismiss('cancel');
        }else{
            //console.log('改变了');
            NavModalCANConfigService.setCANId($scope.selectCANId);
            $uibModalInstance.close($scope.selectCANId);
        }

    };
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * CAN配置service
 * @param  {[type]} )          
 * @return {[type]}
 */
ide.service('NavModalCANConfigService',[function(){
    var CANId;
    this.setCANId = function(id){
        CANId=id;
    };
    this.getCANId = function(){
        return CANId||''
    };
}]);

ide.controller('NavModalSaveAsCtrl',['$scope','$uibModalInstance',function($scope,$uibModalInstance){
    $scope.saveAsName = "";
    $scope.saveAsAuthor = "";

    $scope.ok = function(){
        var data = {
            saveAsName:$scope.saveAsName,
            saveAsAuthor:$scope.saveAsAuthor
        };
        $uibModalInstance.close(data);
    }
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
}]);