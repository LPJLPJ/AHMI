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
    'OperateQueService', 'TagService', 'ResourceService', 'TimerService', '$http', 'ProjectTransformService', 'RenderSerive', 'LinkPageWidgetsService', 'NavModalCANConfigService', function ($scope, $timeout,
                                                                                                                                                                                              GlobalService,
                                                                                                                                                                                              NavService,
                                                                                                                                                                                              saveProjectModal,
                                                                                                                                                                                              ProjectService,
                                                                                                                                                                                              TemplateProvider,
                                                                                                                                                                                              ProjectFileManage,
                                                                                                                                                                                              Type,
                                                                                                                                                                                              CanvasService,
                                                                                                                                                                                              $uibModal,
                                                                                                                                                                                              OperateQueService, TagService, ResourceService, TimerService, $http, ProjectTransformService, RenderSerive, LinkPageWidgetsService, NavModalCANConfigService) {

        var path, fs, __dirname, fse;
        initLocalPref();
        initUserInterface();
        confirmForClosingWindow();

        $scope.$on('GlobalProjectReceived', function () {


            initProject();
            $scope.$emit('LoadUp');

        });

        $scope.oldWidget = {
            name: '',
            coordinate: 0,
        }

        /**
         * 初始化Nav界面
         */

        function initLocalPref() {
            if (window.local) {
                path = require('path');
                fs = require('fs');
                fse = require('fs-extra');
                __dirname = global.__dirname;
            }
        }

        function initUserInterface() {
            $scope.component = {
                nav: {
                    currentNav: -1,
                    navs: [{name: '文件'},
                        {name: '开始'},
                        {name: '编辑'},
                        {name: '格式'},
                        {name: '视图'},
                        {name: '帮助'}],
                    changeNav: changeNav
                },

                tool: {
                    toolShow: false,
                    operateQueStatus: OperateQueService.getOperateQueStatus(),
                    deleteStatus: false,
                    sublayerStatus: false,
                    undo: undo,
                    redo: redo,
                    copy: copy,
                    cut: cut,
                    paste: paste,
                    selectAll: selectAll,
                    clearAll: clearAll,
                    addLayer: addLayer,
                    addSubLayer: addSubLayer,
                    deleteObject: deleteObject,
                    addWidget: addWidget,
                    openProject: openProject,
                    generateDataFile: generateDataFile,
                    play: play,
                    openPanel: openPanel,
                    openShare: openShare,
                    openCANPanel: openCANPanel,
                    openTagsPanel: openTagsPanel,
                    runSimulator: runSimulator,
                    closeSimulator: closeSimulator,
                    saveProject: saveProject.bind(null, null, true),
                    saveProjectAs: saveProjectAs,
                    showLeft: showLeft,
                    showRight: showRight,
                    showBottom: showBottom,
                    rotateCanvasLeft: rotateCanvasLeft,
                    rotateCanvasRight: rotateCanvasRight
                },
                simulator: {
                    show: false
                }
            };

        }

        function initProject() {
            ProjectService.getProjectTo($scope);
            $scope.$on('NavStatusChanged', onNavStatusChanged);

            $scope.$on('OpenSimulator', $scope.component.tool.play)
            // setInterval(function () {
            //     saveProject();
            // }.bind(this),5*60*1000)

        }

        //spinner

        function showSpinner() {
            if (window.spinner) {
                window.spinner.setBackgroundColor('rgba(0,0,0,0.5)');
                window.spinner.show({progress: false});
            }
        }

        function hideSpinner() {
            window.spinner && window.spinner.hide();
        }


        function showLeft() {
            $scope.$emit('ChangeShownArea', 0);
        }

        function showRight() {
            $scope.$emit('ChangeShownArea', 1);
        }

        function showBottom() {
            $scope.$emit('ChangeShownArea', 2);
        }

        function rotateCanvasLeft() {
            var c = document.getElementById('c');
            var backgroundCanvas = document.getElementById('backgroundCanvas');
            var c1 = document.getElementById('c1');
            c.style.cssText = "transform:rotate(270deg);left:0;top:0";
            backgroundCanvas.style.cssText = "transform:rotate(270deg);left:0;top:0";
            c1.style.cssText = "transform:rotate(270deg);left:0;top:0";
        }

        function rotateCanvasRight() {
            var c = document.getElementById('c');
            var backgroundCanvas = document.getElementById('backgroundCanvas');
            var c1 = document.getElementById('c1');
            c.style.cssText = "transform:rotate(0deg);left:0;top:0";
            backgroundCanvas.style.cssText = "transform:rotate(0deg);left:0;top:0";
            c1.style.cssText = "transform:rotate(0deg);left:0;top:0";
        }

        //listen for nw.win.close
        function confirmForClosingWindow() {
            if (window.local) {
                var win = nw.Window.get();
                var shouldClose = false;
                var closing = false;
                win.on('close', function (e) {
                    if (!closing) {
                        closing = true;
                        if (!getSaveStatus()) {
                            closing = true;
                            openCloseWindowPanel(function () {
                                //sc
                                saveProject(function () {
                                    //real close
                                    win.close(true);
                                }.bind(this), true)
                            }.bind(this), function () {
                                //fc
                                win.close(true);
                            }.bind(this));
                        } else {
                            win.close(true);
                        }
                    }

                }.bind(this));
            } else {
                window.addEventListener("beforeunload", function (event) {

                    if (!getSaveStatus()) {
                        event.returnValue = "请确定已保存您的工程";
                    } else {
                        console.log('projects have been saved');
                    }
                });
            }
        }

        function getPlatform() {
            if (window.local) {
                return process.platform;
            } else {
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
        function scaleImg(srcDataUrl, typeParams, distWidth, distHeight, keepRatio, _cb) {
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
                if (!!keepRatio) {
                    //keep ratio
                    var hori = originWidth > originHeight;
                    if (hori) {
                        var curHeight = originHeight * 1.0 / originWidth * distWidth;
                        var offsetHeight = (distHeight - curHeight) / 2.0;
                        offCtx.drawImage(tempImg, 0, offsetHeight, distWidth, curHeight);
                    } else {
                        var curWidth = originWidth * 1.0 / originHeight * distHeight;
                        var offsetWidth = (distWidth - curWidth) / 2.0;
                        offCtx.drawImage(tempImg, offsetWidth, 0, curWidth, distHeight);
                    }

                } else {
                    offCtx.drawImage(tempImg, 0, 0, distWidth, distHeight);
                }
                //get offCtx
                var type = typeParams[0];
                if (type == 'jpeg') {
                    _cb && _cb(offCanvas.toDataURL('image/jpeg', typeParams[1] || 0.8));
                } else {
                    _cb && _cb(offCanvas.toDataURL('image/png'));
                }

            }

            tempImg.onerror = function () {
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


        function saveProject(_saveCb, useSpinner, compatible) {
            // ProjectService.getProjectTo($scope);
            //console.log('save arguments',arguments);
            if (useSpinner) {
                showSpinner();
            }
            ProjectService.addSaveInfo();
            var projectClone = ProjectService.SaveCurrentOperate();
            ProjectService.changeCurrentPageIndex(0,
                function () {
                    var curScope = {};
                    ProjectService.getProjectCopyTo(curScope);
                    // curScope.project = ProjectTransformService.transDateFileBase(curScope.project);//+
                    if (compatible) {
                        generateProJson(curScope.project, function (newProject) {
                            curScope.project = newProject;
                            postFun();
                        })
                    } else {
                        postFun();
                    }

                    function postFun() {
                        curScope.project.resourceList = ResourceService.getAllResource();
                        curScope.project.customTags = TagService.getAllCustomTags();
                        curScope.project.timerTags = TagService.getAllTimerTags();//-
                        curScope.project.timers = TagService.getTimerNum();//-
                        curScope.project.version = window.ideVersion;
                        curScope.project.CANId = NavModalCANConfigService.getCANId();
                        var currentProject = curScope.project;
                        var thumb = _.cloneDeep(currentProject.pages[0].url);
                        scaleImg(thumb, ['jpeg'], 200, 200, true, function (scaledThumb) {
                            _.forEach(currentProject.pages, function (_page) {
                                _page.url = '';
                                _.forEach(_page.layers, function (_layer) {
                                    _layer.url = '';
                                    _layer.showSubLayer.url = '';
                                    _.forEach(_layer.subLayers, function (_subLayer) {
                                        _subLayer.url = '';
                                    })

                                })
                            });
                            if (window.local) {
                                saveThumb(scaledThumb, function () {
                                    //save
                                    //save currentProject
                                    var projectUrl = ResourceService.getProjectUrl();
                                    var dataUrl = path.join(projectUrl, 'project.json');
                                    var resourceUrl = path.join(projectUrl, 'resources');
                                    var resourceIds = currentProject.resourceList && currentProject.resourceList.map(function (file) {
                                        return file.id;
                                    });
                                    try {
                                        var oldProjectData = JSON.parse(fs.readFileSync(dataUrl));
                                        oldProjectData.lastModifiedTime = new Date().toLocaleString();
                                        oldProjectData.thumbnail = path.join(projectUrl, 'thumbnail.jpg');
                                        // console.log(oldProjectData.thumbnail);
                                        oldProjectData.content = JSON.stringify(currentProject);
                                        if (oldProjectData.backups && oldProjectData.backups instanceof Array) {

                                        } else {
                                            oldProjectData.backups = []
                                        }
                                        if (oldProjectData.backups.length >= 5) {
                                            oldProjectData.backups.shift()
                                        }
                                        oldProjectData.backups.push({
                                            time: new Date(),
                                            content: oldProjectData.content
                                        });

                                        //delete file
                                        fs.readdir(resourceUrl, function (err, files) {
                                            if (err) {
                                                console.log('err in read files', err);

                                            } else if (files && files.length) {
                                                var diffResources = _.difference(files, resourceIds);
                                                diffResources.map(function (dFile) {
                                                    var dFilePath = path.join(resourceUrl, dFile);
                                                    // console.log(dFilePath)
                                                    fs.stat(dFilePath, function (err, stats) {
                                                        // console.log(stats)
                                                        if (stats && stats.isFile()) {
                                                            fs.unlink(dFilePath);
                                                        }
                                                    })
                                                });
                                            }
                                        });

                                        //save json
                                        fs.writeFileSync(dataUrl, JSON.stringify(oldProjectData));
                                        //success
                                        toastr.info('保存成功');
                                        ProjectService.LoadCurrentOperate(projectClone, function () {
                                            $scope.$emit('UpdateProject');
                                            //change url
                                            var newUrl = '/project/' + currentProject.projectId + '/editor'
                                            history.pushState(null, '', newUrl);
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
                                            var saveState = false
                                            if (t == 'ok') {
                                                toastr.info('保存成功');
                                                saveState = true
                                            } else {
                                                toastr.warning('保存失败')
                                            }
                                            if (useSpinner) {
                                                hideSpinner();
                                            }
                                            ProjectService.LoadCurrentOperate(projectClone, function () {
                                                $scope.$emit('UpdateProject');
                                                //modify url
                                                if (saveState) {
                                                    var newUrl = '/project/' + currentProject.projectId + '/editor'
                                                    if ("undefined" !== typeof history.pushState) {
                                                        history.pushState(null, '', newUrl)
                                                    } else {
                                                        window.location.assign(newUrl)
                                                    }
                                                }
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

                            function uploadThumb(thumb, _callback) {
                                $http({
                                    method: 'POST',
                                    url: '/project/' + currentProject.projectId + '/thumbnail',
                                    data: {
                                        thumbnail: thumb
                                    }
                                })
                                    .success(function (r) {
                                        console.log(r);
                                        _callback && _callback();
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
                    }

                    //console.log(thumb)
                });
        }

        function saveProjectAs() {
            var projectId = ProjectService.getProjectId();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'saveAsModal.html',
                controller: 'NavModalSaveAsCtrl',
                size: 'md',
                resolve: {}
            });
            if (window.local) {
                //for local
                modalInstance.result.then(function (result) {
                    showSpinner();
                    var projectUrl = ResourceService.getProjectUrl(),
                        oldJsonUrl = path.join(projectUrl, 'project.json'),
                        newId = '' + Date.now() + Math.round((Math.random() + 1) * 1000),
                        pattern = new RegExp(String(projectId), "g"),
                        localProjectPath = path.join(__dirname, 'localproject'),
                        projectStr = readSingleFile(oldJsonUrl, true),
                        project;

                    projectStr = projectStr.replace(pattern, newId);
                    project = JSON.parse(projectStr);
                    (!!result.saveAsName) ? (project.name = result.saveAsName) : (project.name = project.name + '副本');
                    (!!result.saveAsAuthor) ? (project.author = result.saveAsAuthor) : '';
                    if (result.saveAsResolution) {
                        project.content = saveAsReset(result.saveAsResolution, project.resolution, project.content);
                        project.resolution = result.saveAsResolution;
                    }


                    project.createTime = new Date().toLocaleString();
                    project.lastModifiedTime = new Date().toLocaleString();


                    var newProjectPath = path.join(localProjectPath, newId);

                    fse.emptyDir(newProjectPath, function (err) {
                        if (err) {
                            console.log(err);
                            toastr.error('另存为出错');
                        }
                        console.log(projectUrl, newProjectPath);
                        fse.copy(projectUrl, newProjectPath, function (err) {
                            if (err) {
                                console.error(err);
                                toastr.error('另存为出错');
                            }
                            fse.writeFile(path.join(newProjectPath, 'project.json'), JSON.stringify(project), function (err) {
                                if (err) {
                                    console.log(err);
                                    toastr.error('另存为出错');
                                }
                                hideSpinner();
                                toastr.info('另存为成功!');
                                window.opener.location.reload();
                            })
                        })
                    })

                })
            } else {
                modalInstance.result.then(function (result) {
                    //console.log('result',result);
                    showSpinner();
                    $http({
                        method: 'POST',
                        url: '/project/' + projectId + '/saveAs',
                        data: result
                    })
                        .success(function (data) {
                            console.log('data', data);
                            if (data == 'ok') {
                                hideSpinner();
                                toastr.info('另存为成功');
                                if (window.opener) {
                                    window.opener.location.reload();
                                }
                            }
                        })
                        .error(function (err) {
                            console.log(err);
                            toastr.info('另存为失败');
                            hideSpinner();
                        })

                }, function (str) {
                    //console.log(str);
                })
            }
        };

        //另存为重新设置项目及其内部控件大小
        function saveAsReset(newResolution, oldResolution, content) {
            var widthProportion = (newResolution.split("*")[0]) / (oldResolution.split("*")[0]);
            var heightProportion = (newResolution.split("*")[1]) / (oldResolution.split("*")[1]);
            var content = JSON.parse(content);
            for (var a in content.pages) {
                if (content.pages[a].layers) {
                    for (var b in content.pages[a].layers) {
                        var layerInfo = content.pages[a].layers[b].info;
                        layerInfo.width = Math.round(layerInfo.width * widthProportion);
                        layerInfo.height = Math.round(layerInfo.height * heightProportion);
                        layerInfo.left = Math.round(layerInfo.left * widthProportion);
                        layerInfo.top = Math.round(layerInfo.top * heightProportion);
                        if (content.pages[a].layers[b].subLayers) {
                            for (var c in content.pages[a].layers[b].subLayers) {
                                for (var d in content.pages[a].layers[b].subLayers[c].widgets) {
                                    var type = content.pages[a].layers[b].subLayers[c].widgets[d].type;
                                    var widgetInfo = content.pages[a].layers[b].subLayers[c].widgets[d].info;

                                    widgetInfo.width = Math.round(widgetInfo.width * widthProportion);
                                    widgetInfo.height = Math.round(widgetInfo.height * heightProportion);
                                    widgetInfo.left = Math.round(widgetInfo.left * widthProportion);
                                    widgetInfo.top = Math.round(widgetInfo.top * heightProportion);
                                    if (type == "MyButton" || type == 'MyTextArea') {
                                        widgetInfo.fontSize = Math.round(widgetInfo.fontSize * widthProportion);
                                    }
                                    if (type == 'MyTexNum' || type == 'MyTexTime') {
                                        widgetInfo.characterW = Math.round(widgetInfo.characterW * widthProportion);
                                        widgetInfo.characterH = Math.round(widgetInfo.characterH * heightProportion);
                                    }
                                    //added by LH in 2017/12/20
                                    if (type == 'MyTexTime') {
                                        widgetInfo.characterW = Math.round(widgetInfo.characterW * widthProportion);
                                        widgetInfo.characterH = Math.round(widgetInfo.characterH * heightProportion);
                                    }
                                    if (type == "MyDateTime" || type == 'MyNum') {
                                        widgetInfo.fontSize = Math.round(widgetInfo.fontSize * widthProportion);
                                        widgetInfo.maxFontWidth = Math.round(widgetInfo.maxFontWidth * widthProportion);
                                        widgetInfo.spacing = Math.round((widgetInfo.spacing || 0) * widthProportion);
                                    }
                                    if (type == "MyDashboard") {
                                        widgetInfo.pointerLength = Math.round(widgetInfo.pointerLength * widthProportion);
                                    }

                                }
                            }
                        }
                        if (content.pages[a].layers[b].showSubLayer) {
                            for (var h in content.pages[a].layers[b].showSubLayer.widgets) {
                                var type1 = content.pages[a].layers[b].showSubLayer.widgets[h].type;
                                var showWidgetInfo = content.pages[a].layers[b].showSubLayer.widgets[h].info;

                                showWidgetInfo.width = Math.round(showWidgetInfo.width * widthProportion);
                                showWidgetInfo.height = Math.round(showWidgetInfo.height * heightProportion);
                                showWidgetInfo.left = Math.round(showWidgetInfo.left * widthProportion);
                                showWidgetInfo.top = Math.round(showWidgetInfo.top * heightProportion);
                                if (type1 == "MyButton" || type1 == 'MyTextArea') {
                                    showWidgetInfo.fontSize = Math.round(showWidgetInfo.fontSize * widthProportion);
                                }
                                if (type1 == 'MyTexNum' || type == 'MyTexTime') {
                                    showWidgetInfo.characterW = Math.round(showWidgetInfo.characterW * widthProportion);
                                    showWidgetInfo.characterH = Math.round(showWidgetInfo.characterH * heightProportion);
                                }
                                if (type1 == "MyDateTime" || type1 == 'MyNum') {
                                    showWidgetInfo.fontSize = Math.round(showWidgetInfo.fontSize * widthProportion);
                                    showWidgetInfo.maxFontWidth = Math.round(showWidgetInfo.maxFontWidth * widthProportion);
                                }
                                if (type1 == "MyDashboard") {
                                    showWidgetInfo.pointerLength = Math.round(showWidgetInfo.pointerLength * widthProportion);
                                }
                            }
                        }
                        //修改动画
                        if (content.pages[a].layers[b].animations) {
                            for (var x in content.pages[a].layers[b].animations) {
                                var translate = content.pages[a].layers[b].animations[x].animationAttrs.translate;

                                translate.srcPos.x = Math.round(translate.srcPos.x * widthProportion);
                                translate.srcPos.y = Math.round(translate.srcPos.y * heightProportion);
                                translate.dstPos.x = Math.round(translate.dstPos.x * widthProportion);
                                translate.dstPos.y = Math.round(translate.dstPos.y * heightProportion);
                            }
                        }
                    }
                }
            }
            return JSON.stringify(content);
        }

        /**
         * 改变nav
         * @param index nav序号
         */
        function changeNav(index) {
            if (index != $scope.component.nav.currentNav) {
                $scope.component.nav.currentNav = index;
                $scope.component.tool.toolShow = true;

            } else {
                $scope.component.tool.toolShow = !$scope.component.tool.toolShow;
            }
            $scope.$emit('ChangeToolShow', $scope.component.tool.toolShow);
            $scope.$broadcast('ChangeToolShow', $scope.component.tool.toolShow);
        }

        function onNavStatusChanged() {
            $timeout(function () {
                //更新撤销重做的状态
                $scope.component.tool.operateQueStatus = NavService.getOperateQueStatus();

                //更新删除的状态
                $scope.component.tool.deleteStatus = NavService.getDeleteStatus();

                //更新添加图层的状态
                $scope.component.tool.layerStatus = NavService.getLayerStatus();

                //更新添加Widget的状态
                $scope.component.tool.widgetStatus = NavService.getWidgetStatus();

                $scope.component.tool.copyStatus = NavService.getCopyStatus();

                $scope.component.tool.pasteStatus = NavService.getPasteStatus();

                $scope.component.tool.sublayerStatus = NavService.getSubLayerStatus();

                $scope.component.tool.pageStatus = NavService.getPageStatus();
            })
        }

        /**
         * 添加一个Layer
         */
        function addLayer() {
            if (!NavService.getLayerStatus()) {
                console.warn('不在对应模式');
                return;
            }

            var oldOperate = ProjectService.SaveCurrentOperate();
            var defaultLayer = TemplateProvider.getDefaultLayer();
            ProjectService.AddNewLayerInCurrentPage(defaultLayer, function () {
                $timeout(function () {
                    $scope.$emit('ChangeCurrentPage', oldOperate);
                })

            });

        }

        function addSubLayer() {
            if (!NavService.getSubLayerStatus()) {
                return;
            }
            var oldOperate = ProjectService.SaveCurrentOperate();
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
        function addWidget(_index) {
            if (!NavService.getWidgetStatus()) {
                return;
            }
            var oldOperate = ProjectService.SaveCurrentOperate();
            var newWidget = null;
            if (_index === 0) {
                newWidget = TemplateProvider.getDefaultSlide();
            }
            else if (_index === 2) {

                newWidget = TemplateProvider.getDefaultProgress();
            } else if (_index === 3) {
                newWidget = TemplateProvider.getDefaultDashboard();
            } else if (_index === 8) {

                newWidget = TemplateProvider.getDefaultButton();
            }
            //else if (_index==9){
            //    newWidget=TemplateProvider.getDefaultNumber();}
            else if (_index === 10) {
                newWidget = TemplateProvider.getDefaultButtonGroup();
            }
            // else if(_index==10){
            //     newWidget=TemplateProvider.getDefaultKnob();
            // }
            else if (_index === 7) {
                newWidget = TemplateProvider.getDefaultTextArea();
            }
            else if (_index === 6) {
                newWidget = TemplateProvider.getDefaultNum();
            }
            // else if(_index==4){
            //     newWidget=TemplateProvider.getDefaultOscilloscope();
            // }
            else if (_index === 1) {
                newWidget = TemplateProvider.getDefaultSwitch();
            } else if (_index === 4) {
                newWidget = TemplateProvider.getDefaultRotateImg();
            }
            else if (_index === 5) {
                newWidget = TemplateProvider.getDefaultDateTime();
            } else if (_index === 11) {
                newWidget = TemplateProvider.getDefaultScriptTrigger();
            } else if (_index === 9) {
                newWidget = TemplateProvider.getDefaultSlideBlock();
            } else if (_index === 12) {
                newWidget = TemplateProvider.getDefaultVideo();
            } else if (_index === 13) {
                newWidget = TemplateProvider.getDefaultAnimation();
            } else if (_index === 14) {
                newWidget = TemplateProvider.getDefaultTexNum();
            } else if (_index === 15) {
                newWidget = TemplateProvider.getDefaultTexTime();
            }
            else {
                return;
            }
            if (newWidget.name == $scope.oldWidget.name) {
                $scope.oldWidget.coordinate += 20;
                newWidget.info.left = $scope.oldWidget.coordinate;
                newWidget.info.top = $scope.oldWidget.coordinate;
            } else {
                $scope.oldWidget.name = newWidget.name;
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
        function undo() {

            NavService.DoUndo(function () {
                $scope.$emit('Undo');

            })
        }

        /**
         * 重做
         */
        function redo() {
            NavService.DoRedo(function () {
                $scope.$emit('Redo');

            })
        }

        function copy(_callback) {

            NavService.DoCopy(function () {
                $scope.$emit('DoCopy');
                _callback && _callback();

            })
        }


        function cut() {
            copy(function () {
                deleteObject();
            })
        }

        function selectAll(_successCallback) {
            ProjectService.OnSelectAll(_successCallback);
        }

        function clearAll() {
            selectAll(function () {
                deleteObject();
            })
        }

        function paste() {
            var oldOperate = ProjectService.SaveCurrentOperate();

            NavService.DoPaste(function () {
                $timeout(function () {
                    $scope.$emit('ChangeCurrentPage', oldOperate);

                })

            })


        }

        function deleteObject() {

            var oldOperate = ProjectService.SaveCurrentOperate();

            NavService.DoDelete(function () {
                $timeout(function () {
                    $scope.$emit('ChangeCurrentPage', oldOperate);

                })

            })
        }

        function openProject() {
            ProjectFileManage.OpenProject(function () {

            })
        }

        /**
         * 生成符合格式的数据结构
         */

        function generateDataFile(format) {
            if (format == 'local' || format == 'localCompatible') {
                var curScope = {};
                var postFun = function () {
                    if (window.spinner) {
                        window.spinner.setBackgroundColor('rgba(0,0,0,0.5)');
                        showSpinner();
                    }
                    $http({
                        method: 'POST',
                        url: '/project/' + $scope.project.projectId + '/generateLocalProject'
                        //data:{currentProject:currentProject}
                    })
                        .success(function (data, status, xhr) {
                            window.spinner && window.spinner.hide();
                            if (data == 'ok') {
                                toastr.info('生成本地版成功');
                                window.location.href = '/project/' + $scope.project.projectId + '/downloadLocalProject'
                            } else {
                                toastr.error('生成失败')
                            }
                        })
                        .error(function (err, status, xhr) {
                            window.spinner && window.spinner.hide();
                            toastr.error('生成失败,请尝试先保存');
                            console.log(err);
                        })
                };
                ProjectService.getProjectCopyTo(curScope);
                if (format === 'localCompatible') {
                    saveProject(postFun, true, true);
                    // console.log(curScope.project);
                } else {
                    postFun();
                }

            } else {
                generateData(format);
                if (window) {
                    if (window.spinner) {
                        window.spinner.setBackgroundColor('rgba(0,0,0,0.5)');
                        showSpinner();
                    }
                    RenderSerive.renderProject(window.projectData, function () {
                        toastr.info('生成成功');
                        window.spinner && window.spinner.hide();
                    }, function () {
                        toastr.info('生成失败');
                        window.spinner && window.spinner.hide();
                    });
                } else {
                    saveProject(function () {
                        showSpinner();
                        $http({
                            method: 'POST',
                            url: '/project/' + $scope.project.projectId + '/generate',
                            data: {
                                dataStructure: window.projectData
                            }
                        })
                            .success(function (data, status, xhr) {
                                hideSpinner();
                                if (data == 'ok') {
                                    toastr.info('生成成功');
                                    //download
                                    window.location.href = '/project/' + $scope.project.projectId + '/download'
                                } else {
                                    console.log(data);
                                    toastr.info('生成失败')
                                }


                            })
                            .error(function (err, status, xhr) {
                                hideSpinner();
                                console.log(err);
                                toastr.info('生成失败')

                            })
                    })
                }
            }
        }

        function generateData(format) {
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


        /**
         * 为工程生成proJSON，用来兼容旧的本地版IDE
         * @param rawData
         */
        function generateProJson(project, cb) {
            var newProject = _.cloneDeep(project),
                i = 0,//循环变量
                attrArr = [],//属性名数组
                pageNode = new fabric.Canvas('tmp1'),
                subLayerNode = new fabric.Canvas('tmp2', {renderOnAddRemove: false});

            i = 0;
            var pageLength = newProject.pages.length;
            var page;
            var index;
            var ergodicPages = function () {
                page = null;
                page = newProject.pages[i];
                index = i;
                pageNode.setWidth(newProject.initSize.width);
                pageNode.setHeight(newProject.initSize.height);
                pageNode.zoomToPoint(new fabric.Point(0, 0), 1);
                // pageNode.clear();
                if (page.layers !== undefined) {
                    page.layers.forEach(function (layer, index) {
                        layer.subLayers.forEach(function (subLayer, index) {
                            subLayerNode.setWidth(layer.w);
                            subLayerNode.setHeight(layer.h);
                            subLayerNode.zoomToPoint(new fabric.Point(0, 0), 1);
                            // subLayerNode.clear();
                            subLayer.widgets.forEach(function (widget, index) {
                                addWidgetInCurrentSubLayer(widget, subLayerNode);
                            });
                            subLayer.proJsonStr = subLayerNode.toJSON();
                            subLayerNode.clear();
                        });
                        addWidgetInCurrentSubLayer(layer, pageNode)
                    });
                    if (page.backgroundImage && page.backgroundImage !== '') {
                        pageNode.setBackgroundImage(page.backgroundImage, function () {
                            pageNode.setBackgroundColor(page.backgroundColor, function () {
                                page.proJsonStr = pageNode.toJSON();
                                pageNode.clear();
                                i++;
                                if (i < pageLength) {
                                    ergodicPages();
                                } else {
                                    // console.log('after preprocess',newData);
                                    cb && cb(newProject)
                                }
                            });
                        }, {
                            width: pageNode.getWidth(),
                            height: pageNode.getHeight()
                        });
                    } else {
                        pageNode.setBackgroundImage(null, function () {
                            pageNode.setBackgroundColor(page.backgroundColor, function () {
                                page.proJsonStr = pageNode.toJSON();
                                pageNode.clear();
                                i++;
                                if (i < pageLength) {
                                    ergodicPages();
                                } else {
                                    // console.log('after preprocess',newData);
                                    cb && cb(newProject)
                                }
                            });
                        });
                    }
                }
            };
            ergodicPages();
        }

        /**
         * 将widget加入sublayer
         * @param dataStructure
         * @param node
         * @param _successCallback
         */
        function addWidgetInCurrentSubLayer(dataStructure, node, _successCallback) {
            var initiator = {
                width: dataStructure.info.width,
                height: dataStructure.info.height,
                top: dataStructure.info.top,
                left: dataStructure.info.left,
                id: dataStructure.id,
                lockScalingFlip: true,
                hasRotatingPoint: false,
                shadow: {
                    color: 'rgba(0,0,0,0.4)', blur: 2
                }
            };
            var addFabWidget = function (fabWidget) {
                node.add(fabWidget);
            };

            switch (dataStructure.type) {
                case 'MySlide':
                    fabric.MySlide.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyProgress':
                    fabric.MyProgress.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyDashboard':
                    fabric.MyDashboard.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyButton':
                    fabric.MyButton.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyButtonGroup':
                    fabric.MyButtonGroup.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyNumber':
                    fabric.MyNumber.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyTextArea':
                    fabric.MyTextArea.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyKnob':
                    fabric.MyKnob.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyOscilloscope':
                    fabric.MyOscilloscope.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MySwitch':
                    fabric.MySwitch.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyRotateImg':
                    fabric.MyRotateImg.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyDateTime':
                    fabric.MyDateTime.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyScriptTrigger':
                    fabric.MyScriptTrigger.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyVideo':
                    fabric.MyVideo.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyAnimation':
                    fabric.MyAnimation.fromLevel(dataStructure, addFabWidget, initiator);
                    break;
                case 'MyLayer':
                    node.add(new fabric.MyLayer(dataStructure, initiator));
                    break;
                case 'MyNum':
                    node.add(new fabric.MyNum(dataStructure, initiator));
                    break;
                case 'MyTexNum':
                    node.add(new fabric.MyTexNum(dataStructure, initiator));
                    break;
                default :
                    console.error('not match widget in preprocess!');
                    break;
            }

        };

        function play() {
            generateData()
            window.cachedResourceList = ResourceService.getGlobalResources();

            $scope.component.simulator.show = true;

        }

        function closeSimulator() {

            $scope.component.simulator.show = false;

        }

        function runSimulator() {
            // console.log(window.runSimulator);
        }


        //modal for closing window
        function openCloseWindowPanel(sc, fc) {


            /**
             * 利用$uiModal服务，制作模态窗口
             */
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'navModalCloseWindow.html',
                controller: 'NavModalCloseWindwoCtl',
                size: 'md',
                backdrop: 'static',
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
                resolve: {}
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

        function getSaveStatus() {
            var status = false;//未save
            if (document.getElementById("saveFlag").value === "true") {
                status = true;
            }
            return status;
        }

        function openShare() {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'shareModal.html',
                controller: 'shareModalCtl',
                scope: $scope,
                size: 'md',
                resolve: {
                    id: function () {
                        return $scope.project.projectId
                    }
                }
            });

            modalInstance.result.then(function (result) {
                generateDataFile(result.format);
            }, function () {

            });
        }


        /**
         * 打开CAN配置模态框
         * @return {[type]} [description]
         */
        function openCANPanel() {
            var CANInfo;
            if (window.local) {
                var CANProjects = readLocalProjects('CAN').map(function (raw) {
                    return JSON.parse(raw);
                });
                var CANInfo = CANProjects.map(function (obj) {
                    return {
                        name: obj.name,
                        id: obj._id
                    }
                })
                //console.log('CANProject',CANInfo);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'navCANModal.html',
                    controller: 'NavModalCANConfig',
                    size: 'md',
                    resolve: {
                        data: function () {
                            return CANInfo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        var targetPro = null;
                        for (var i = 0; i < CANProjects.length; i++) {
                            if (CANProjects[i]._id == result) {
                                targetPro = JSON.parse(CANProjects[i].content);
                                break;
                            }
                        }
                        if (targetPro) {
                            importCANConfig(result, targetPro);
                        } else {
                            toastr.error('导入失败');
                        }
                    } else {
                        deleteCANConfig();
                    }
                }, function () {
                })
            } else {
                $http({
                    method: 'GET',
                    url: '/CANProject/names'
                })
                    .success(function (data, status, xhr) {
                        //console.log('data',data);
                        CANInfo = data;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'navCANModal.html',
                            controller: 'NavModalCANConfig',
                            size: 'md',
                            resolve: {
                                data: function () {
                                    return CANInfo;
                                }
                            }
                        });

                        modalInstance.result.then(function (result) {
                            //console.log('result',result);
                            if (result) {
                                importCANConfig(result);
                            } else {
                                deleteCANConfig();
                            }
                        }, function () {
                        })
                    })
                    .error(function (err) {
                        console.log('err', err);
                        toastr.warning('获取失败');
                    });
            }
        }

        /**
         * 打开Tags导入模态框
         */
        function openTagsPanel() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'tagsImport.html',
                controller: ['$scope', '$uibModalInstance', '$http', function ($scope, $uibModalInstance, $http) {

                    $scope.selectedTagId = null;

                    $scope.ok = function(){
                        console.log('haha');
                        if(!$scope.selectedTagId){
                            return;
                        }
                        getTagsFromRemote($scope.selectedTagId);
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function(){
                        $uibModalInstance.dismiss();
                    };

                    function getTagsFromRemote(id){
                        var pattern = new RegExp(/tags_default\d+$/g);
                        var url = '';

                        if(pattern.test(id)){
                            //sys
                            url = '/public/ide/modules/tagConfig/template/'+id.replace('_','.')+'.json';
                        }else{
                            //custom
                        }
                        $http({
                            method:'get',
                            url:url
                        }).success(function(data){
                            handler(null,data);
                        }).error(function(err){
                            handler(err,null);
                        });
                    };

                    function handler(err,data){
                        if(err){
                            console.error('err in get tags template');
                            toastr.error('获取失败，请检查您的网络');
                            return;
                        }
                        console.log('data',data);
                    }
                }],
                scope: $scope,//指定父scope
                size: 'md'
            });

        }

        /**
         * 读取本地CAN工程文件
         * @param  {string} projectType 文件类型
         * @return {arr}             文件数组
         */
        function readLocalProjects(projectType) {
            var dir;
            var fileName;
            var localCANProjectDir = path.join(__dirname, 'localproject', 'localCANProject');

            switch (projectType) {
                case 'CAN':
                    dir = localCANProjectDir;
                    fileName = 'CANProject.json';
                    break;
                case 'normal':
                default:
                    dir = localProjectDir;
                    fileName = 'project.json';
                    break;
            }

            // console.log('dir',dir);
            var projects = [];
            try {
                var stats = fs.statSync(dir);
                if (stats && stats.isDirectory()) {
                    var projectNames = fs.readdirSync(dir);
                    for (var i = 0; i < projectNames.length; i++) {
                        var curProjectDir = path.join(dir, projectNames[i]);
                        var curProject = readSingleFile(path.join(curProjectDir, fileName), true);
                        if (curProject) {
                            projects.push(curProject);
                        }
                    }
                }
            } catch (err) {

            }

            return projects;
        }

        /**
         * 读取一个文件
         * @param  {[type]} filePath [description]
         * @param  {[type]} check    [description]
         * @return {[type]}          [description]
         */
        function readSingleFile(filePath, check) {
            if (check) {
                try {
                    var stats = fs.statSync(filePath);
                    if (stats && stats.isFile()) {
                        return fs.readFileSync(filePath, 'utf-8');
                    } else {
                        return null;
                    }
                } catch (e) {
                    return null;
                }


            } else {
                return fs.readFileSync(filePath, 'utf-8');
            }
        }

        /**
         * 导入CAN配置
         * @param  {[type]} id [CAN]
         * @return {[type]}    [description]
         */
        function importCANConfig(id, pro) {
            if (window.local) {
                var localProjectResourcesDir = path.join(__dirname, 'localproject', $scope.project.projectId, 'resources');
                try {
                    var stats = fs.statSync(localProjectResourcesDir);
                    if (stats.isDirectory()) {
                        var dataUrl = path.join(localProjectResourcesDir, 'CANFile.json');
                        fs.writeFileSync(dataUrl, JSON.stringify(pro, null, 4));
                        toastr.info('导入成功');
                    } else {
                        toastr.error('导入失败');
                    }
                } catch (e) {
                    toastr.error('导入失败');
                }
            } else {
                $http({
                    method: 'POST',
                    url: '/CANProject/' + id + '/importCANFile',
                    data: {
                        projectId: $scope.project.projectId
                    }
                })
                    .success(function (data, status, xhr) {
                        if (data == 'ok') {
                            toastr.info('导入成功');
                        }
                    })
                    .error(function (data, status, xhr) {
                        toastr.error('导入失败');
                        console.log('导入失败', data);
                    });
            }
        }

        /**
         * 删除CAN配置
         * @return {[type]} [description]
         */
        function deleteCANConfig() {
            if (window.local) {
                var localProjectResourcesDir = path.join(__dirname, 'localproject', $scope.project.projectId, 'resources');
                try {
                    var stats = fs.statSync(localProjectResourcesDir);
                    if (stats.isDirectory()) {
                        var dataUrl = path.join(localProjectResourcesDir, 'CANFile.json');
                        fs.unlink(dataUrl, function (err) {
                            if (err) {
                                toastr.error('取消失败')
                            } else {
                                toastr.info('取消CAN配置');
                            }
                        });

                    } else {
                        toastr.error('取消失败');
                    }
                } catch (e) {
                    toastr.error('取消失败');
                }
            } else {
                $http({
                    method: 'POST',
                    url: '/CANProject/' + $scope.project.projectId + '/deleteCANFile',
                    data: {}
                })
                    .success(function (data, status, xhr) {
                        if (data == 'ok') {
                            toastr.info('取消CAN配置')
                        }
                    })
                    .error(function (data, status, xhr) {
                        console.log('删除失败', data);
                    })
            }
        }
    }]);


ide.controller('NavModalCtl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
    $scope.formats = [
        {
            type: 'normal',
            name: '默认'
        },
        {
            type: 'dxt3',
            name: '压缩'
        }
    ];
    var localFormat = {
        type: 'local',
        name: '本地'
    };
    var localFormatCompatible = {
        type: 'localCompatible',
        name: '本地(兼容)'
    }
    if (!window.local) {
        $scope.formats[2] = localFormat;
        $scope.formats[3] = localFormatCompatible
    }
    ;
    $scope.generateFormat = 'normal';
    $scope.ok = function () {
        $uibModalInstance.close({
            format: $scope.generateFormat
        });
    };

    //取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

ide.controller('shareModalCtl', ['$rootScope', '$scope', '$uibModalInstance', '$http', 'id', function ($rootScope, $scope, $uibModalInstance, $http, id) {
    console.log('load', $scope);
    $scope.loading = true
    $scope.processing = false
    $scope.message = '加载中...'
    console.log(window.location)
    $scope.sharedUrl = window.location.href
    $scope.shareInfo = {
        shared: false,
        sharedKey: '',
        readOnlySharedKey: '',
        own: false
    }
    loadInfo()

    function loadInfo() {
        $http({
            method: 'GET',
            url: '/project/' + id + '/share'
        })
            .success(function (data, status, xhr) {
                $scope.shareInfo.shared = data.shared
                $scope.shareInfo.sharedKey = data.sharedKey
                $scope.shareInfo.readOnlySharedKey = data.readOnlySharedKey
                $scope.shareInfo.own = data.own
                $scope.loading = false
                $scope.message = ''
            })
            .error(function (err) {
                console.log(err)
                $scope.loading = false
                $scope.message = '加载出错...'
            });
    }


    $scope.toggleShare = function () {
        $scope.processing = true;
        $http({
            method: 'POST',
            url: '/project/' + id + '/share',
            data: {
                share: !$scope.shareInfo.shared
            }
        })
            .success(function (data, status, xhr) {
                $scope.shareInfo.shared = data.shared
                $scope.shareInfo.sharedKey = data.sharedKey
                $scope.shareInfo.readOnlySharedKey = data.readOnlySharedKey
                $scope.processing = false
                $scope.message = ''

                if (data.shared) {
                    $scope.$emit('createSocketIO');
                } else {
                    $scope.$emit('closeSocketIO');
                }
            })
            .error(function (err) {
                console.log(err)
                $scope.processing = false
                $scope.message = '更新出错...'
            });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss($scope.shareInfo.shared);
    };
}]);


ide.controller('NavModalCloseWindwoCtl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

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
ide.controller('NavModalCANConfig', ['$scope', '$uibModalInstance', 'data', 'NavModalCANConfigService', function ($scope, $uibModalInstance, data, NavModalCANConfigService) {
    $scope.CANInfo = data;
    $scope.selectCANId = NavModalCANConfigService.getCANId();
    $scope.ok = function () {
        if (($scope.selectCANId == null) && (NavModalCANConfigService.getCANId() == null)) {
            //console.log('未改变');
            $uibModalInstance.dismiss('cancel');
        } else {
            //console.log('改变了');
            NavModalCANConfigService.setCANId($scope.selectCANId);
            $uibModalInstance.close($scope.selectCANId);
        }

    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * CAN配置service
 * @param  {[type]} )
 * @return {[type]}
 */
ide.service('NavModalCANConfigService', [function () {
    var CANId;
    this.setCANId = function (id) {
        CANId = id;
    };
    this.getCANId = function () {
        return CANId || ''
    };
}]);

ide.controller('NavModalSaveAsCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
    $scope.saveAsName = "";
    $scope.saveAsAuthor = "";
    $scope.saveAsResolution = "";
    $scope.selectCustomResolution = "1280*480";

    $scope.ok = function () {
        var data = "";
        if (!checkName($scope.saveAsName, $scope.saveAsAuthor)) {
            //invalid name
            toastr.error('名称只能是汉字、英文和数字');
            return;
        } else {
            if ($scope.isScale) {
                if (getResolution()) {
                    var msg = "请尽量保持与原尺寸等比例缩放，否则会导致控件变形";
                    if (confirm(msg) == true) {
                        $scope.selectCustomResolution = getResolution();
                        data = {
                            saveAsName: $scope.saveAsName,
                            saveAsAuthor: $scope.saveAsAuthor,
                            saveAsResolution: $scope.selectCustomResolution
                        }
                    } else {
                        return;
                    }
                } else {
                    toastr.error('分辨率范围有误');
                    return;
                }
            } else {
                data = {
                    saveAsName: $scope.saveAsName,
                    saveAsAuthor: $scope.saveAsAuthor
                };
            }
            $uibModalInstance.close(data);
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    function checkName() {
        // name.match(/["'\/\\\(\){},\.\+\-\*\?]/)
        try {
            for (var i = 0; i < arguments.length; i++) {
                var name = arguments[i];
                if (name.match(/[^\d|A-Z|a-z|\u4E00-\u9FFF| ]/)) {
                    return false;
                }
            }
            return true;

        } catch (e) {
            return false;
        }
    }

    //获取另存为分辨率
    function getResolution() {
        var resolution = "";
        if ($scope.selectCustomResolution == 'custom') {
            if ($scope.saveAsWidth && $scope.saveAsHeight) {
                resolution = $scope.saveAsWidth + '*' + $scope.saveAsHeight;
            } else {
                return false;
            }
        } else {
            resolution = $scope.selectCustomResolution;
        }
        return resolution;
    }
}]);