/**
 * Created by shenaolin on 16/2/26.
 */
var ide = angular.module('ide', ['ui.bootstrap.contextMenu', 'colorpicker.module', 'btford.modal', 'ui.bootstrap', 'ngAnimate', 'GlobalModule', 'ui.tree', 'IDEServices','ui.select', 'ngSanitize','ui.sortable','ngSanitize']);


ide.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension|chrome-extension):/);
    }]);

var baseUrl = '';

var PID = '';
var TOKEN = '';

var MAX_DATA_LENGTH = 100000;

var ideScope;
var isOffline;
var mode = 'DEBUG';

console.log = (function (console) {
    if (mode === 'DEBUG') {
        return console.log;
    } else {
        console.oldLog = console.log;
        return function () {
        }
    }
})(console);



ide.controller('IDECtrl', ['$scope', '$timeout', '$http', '$interval', 'ProjectService', 'GlobalService', 'Preference', 'ResourceService', 'WaveFilterService','TagService', 'TemplateProvider', 'UserTypeService', 'WidgetService', 'NavModalCANConfigService',
    'socketIOService', 'MiddleWareService','TrackService', function ($scope, $timeout, $http, $interval,
                                                      ProjectService,
                                                      GlobalService,
                                                      Preference,
                                                      ResourceService,
                                                      WaveFilterService,
                                                      TagService,
                                                      TemplateProvider, UserTypeService, WidgetService, NavModalCANConfigService, socketIOService, MiddleWareService,TrackService) {

        ideScope = $scope;
        $scope.ide = {
            loaded: false    //页面是否渲染完成
        };

        var loadStep = 0;     //加载到了第几步,共8步
        var fs, path, __dirname;
        var resourcesSizeObj = {}

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        window.audioCtx = audioCtx
        // showIDE();

        //var params=getUrlParams();
        //PID=params.pid;
        //
        //TOKEN=window.localStorage.getItem('token');
        //
        //var offLine=params.offline;
        //
        //isOffline=offLine;
        //if (offLine){
        //    toastr.info('离线测试');
        //}
        //else if (!PID||!TOKEN){
        //    console.log(getUrlParams());
        //    $interval(function () {
        //        toastr.warning('无法识别的项目');
        //    },2000);
        //    return;
        //}

        initUI();

        loadProject();

        //receiveGlobalProject();
        readUserType();

        listenChange();

        loadPreference();

        refreshLoginStatus();

        function initUI() {
            $scope.leftShown = true;
            $scope.rightShown = true;
            $scope.bottomShown = true;

            try {
                var os = require('os');
                if (os) {

                    window.local = true;
                    $scope.local = true;
                    window.ondragover = function (e) {
                        e.preventDefault();
                        return false;
                    }
                    window.ondrop = function (e) {
                        e.preventDefault();
                        return false
                    }
                    __dirname = global.__dirname;
                    path = require('path');
                    fs = require('fs');

                }
            } catch (e) {
                window.local = false;
            }
        }

        function loadProject() {
            if (window.local) {
                readLocalProjectData();
            } else {
                readProjectData();
            }

        }

        function updateSpinner(value) {
            window.spinner && window.spinner.update(value * 100)
        }

        function readUserType() {
            var userType
            if (window.local) {
                var userInfoUrl = path.join(__dirname, 'public', 'nw', 'userInfo.json');
                var userInfo = {
                    name: '',
                    type: 'basic'
                };
                if (!fs.existsSync(userInfoUrl)) {
                    fs.writeFileSync(userInfoUrl, JSON.stringify(userInfo));
                }
                var data = JSON.parse(fs.readFileSync(userInfoUrl, 'utf-8'));
                userType = data.type;
            } else {
                userType = localStorage.getItem('userType');
            }
            UserTypeService.setUserType(userType);
        }

        function readLocalProjectData() {
            var url = window.location.href;
            // var projectId = url.split('?')[1].split('=')[1];
            // if (projectId[projectId.length - 1] === '#') {
            //     projectId = projectId.slice(0, -1);
            // }
            var query = window.location.search;
            if (query && query.length) {
                query = query.slice(1)
            }
            var queryElems = query.split('&') || [];
            var queryObj = {};
            queryElems.forEach(function (q) {
                var pair = q.split('=');
                if (pair.length == 2) {
                    queryObj[pair[0]] = pair[1]
                }
            });
            var projectId = queryObj['project_id'];
            var v = queryObj['v'];
            console.log(projectId);
            //load projectId project
            var projectBaseUrl = path.join(__dirname, 'localproject', projectId);
            ResourceService.setProjectUrl(projectBaseUrl);
            var resourceUrl = path.join(projectBaseUrl, 'resources')+path.sep;
            ResourceService.setResourceUrl(resourceUrl);
            ResourceService.setMaskUrl(path.join('..','..','localproject',projectId,'mask')+path.sep);
            var realDirPath = path.join(__dirname, path.dirname(window.location.pathname));

            ResourceService.setResourceNWUrl(path.relative(realDirPath, resourceUrl));
            var data = readSingleFile(path.join(projectBaseUrl, 'project.json'));
            

            $timeout(function () {
                if (data) {
                    data = JSON.parse(data);
                    //process date content
                    data.backups = data.backups || [];
                    if (data.backups.length > 0) {
                        if (v in data.backups) {
                            data.content = data.backups[v].content || ''
                        }
                    }
                    data.backups = [];
                    LoadWithTemplate(data, projectId);
                } else {
                    loadFromBlank({}, projectId);
                }
            }, 0);


            $scope.$on('LoadUp', function () {

                loadStep++;
                if (loadStep == 6) {
                    //到达第8步,加载完成
                    showIDE();
                }
            })


        }

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


        function LoadWithTemplate(data, id) {
            // console.log('project data.content receive',data);
            var templateId = data.template;
            //add templateId to template
            TemplateProvider.setTemplateId(templateId);
            if (templateId) {
                $http({
                    method: 'GET',
                    url: '/public/templates/defaultTemplate/defaultTemplate.json'
                }).success(function (tdata) {
                    // console.log('get json success',tdata);
                    setTemplate(tdata, function () {
                        var tempData
                        if (typeof data == 'string') {
                            tempData = JSON.parse(data)
                        } else {
                            tempData = data
                        }
                        if (tempData.format !== undefined || tempData.DSFlag === 'base') {
                            //load from a zip
                            getResourcesSize(id,function(err){
                                preProcessData(data, id,function (newData) {
                                    loadFromContent(newData, id);
                                });
                            })
                            
                        } else {
                            loadFromContent(data, id);
                        }
                    }.bind(this));
                }).error(function (msg) {
                    //toastr.warning('读取错误');
                    //loadFromBlank({},id);
                    console.log('get json failed');
                })
            } else {
                // loadFromContent(data,id);
                if (!!data.content) {
                    var tempData = JSON.parse(data.content);
                    if (tempData.format !== undefined) {
                        //load from a zip
                        getResourcesSize(id,function(err){
                            preProcessData(data, id,function (newData) {
                                loadFromContent(newData, id);
                            });
                        })
                        
                    } else {
                        loadFromContent(data, id);
                    }
                } else {
                    loadFromContent(data, id);
                }
            }

        }

        function loadFromContent(data, id) {
            //若是分享的工程，则需要开启socket
            // console.log('data.shared',data);
            // if (!!data.shared) {
            //     if (!!data.readOnlyState) {
            //         //在分享状态下，并且以只读方式打开，不用打开socket进行排队
            //         toastr.options.closeButton = true;
            //         toastr.options.timeOut = 0;
            //         toastr.warning('注意：您无法执行保存工程操作', '只读模式');
            //         toastr.options.closeButton = close;
            //         toastr.options.timeOut = 1000;
            //     } else if (!socketIOService.getSocket()) {
            //         initSocketIO(data.userId);
            //     }

            // }
            if(!local){
                if (!!data.shared&&!!data.readOnlyState) {
                    //在分享状态下，并且以只读方式打开，不用打开socket进行排队
                    toastr.options.closeButton = true;
                    toastr.options.timeOut = 0;
                    toastr.warning('注意：您无法执行保存工程操作', '只读模式');
                    toastr.options.closeButton = close;
                    toastr.options.timeOut = 1000;
                   
                }else if (!socketIOService.getSocket()) {
                    initSocketIO(data.userId);
                }
            }

            var transformSrc = function (key, value) {
                //console.log('key');
                
                if (key == 'src' || key == 'imgSrc' || key == 'backgroundImage' || key == 'backgroundImg') {
                    if (typeof(value) == 'string' && value != '') {
                        if(path.sep == '/'){
                            return value.replace(/\\/g,'/')
                        }else{
                            return value.replace(/\//g,'\\')
                        }
                    } else {
                        return value;
                    }
                }
                return value;
            };
            

            //change html title to name
            var name = data && data.name || '';
            document.title = '工程编辑-' + name;
            var globalProject
            
            if (data.content) {
                

                
                //var globalProject = GlobalService.getBlankProject()
                globalProject = JSON.parse(data.content);
                //process local content with path sep
                if(local){
                    globalProject = JSON.parse(JSON.stringify(globalProject,transformSrc))
                }
                
            }else{
                globalProject = GlobalService.getBlankProject();
            }
             
            var timeStamp = Date.now();
            MiddleWareService.useMiddleWare(globalProject);
            console.log('time costs in inject Data:', Date.now() - timeStamp);


            var resolution = data.resolution.split('*').map(function (r) {
                return Number(r)
            });
            globalProject.name = data.name;
            globalProject.author = data.author;
            globalProject.initSize = {
                width: resolution[0],
                height: resolution[1]
            }
            globalProject.currentSize = {
                width: resolution[0]+200,
                height: resolution[1]+100
            }
            globalProject.maxSize = data.maxSize;
            globalProject.projectId = id;
            globalProject.encoding = data.encoding;
            globalProject.supportTouch = data.supportTouch;
            //console.log('globalProject',globalProject);
            var resourceList = globalProject.resourceList;
            // console.log('resourceList',resourceList);
            var count = resourceList.length;
            var rLen = resourceList.length;
            var globalResources = ResourceService.getGlobalResources();
            window.globalResources = globalResources;

            var coutDown = function (e, resourceObj) {
                if (e.type === 'error') {
                    // console.log(e)
                    toastr.warning('资源加载失败: ' + resourceObj.name);
                    resourceObj.complete = false;
                } else {
                    resourceObj.complete = true;
                }
                count = count - 1;

                updateSpinner((rLen - count) / rLen)
                if (count <= 0) {
                    // toastr.info('loaded');
                    TemplateProvider.saveProjectFromGlobal(globalProject);
                    syncServices(globalProject);
                    ProjectService.saveProjectFromGlobal(globalProject, function () {

                        $scope.$broadcast('GlobalProjectReceived');

                    });
                }
            }.bind(this);
            if (count > 0) {
                for (var i = 0; i < resourceList.length; i++) {
                    var curRes = resourceList[i];
                    // console.log('caching ',i)
                    ResourceService.cacheFileToGlobalResources(curRes, coutDown, coutDown);
                }
            } else {
                // console.log(globalProject);
                updateSpinner(1)
                TemplateProvider.saveProjectFromGlobal(globalProject);
                syncServices(globalProject)
                ProjectService.saveProjectFromGlobal(globalProject, function () {

                    $scope.$broadcast('GlobalProjectReceived');

                });
            } 


        }

        function loadFromBlank(options, id) {
            var globalProject = GlobalService.getBlankProject()
            globalProject.projectId = id;
            //change resolution
            var resolution = (options.resolution || '800*480').split('*').map(function (r) {
                return Number(r)
            })
            globalProject.initSize = {
                width: resolution[0],
                height: resolution[1]
            }
            globalProject.currentSize = {
                width: resolution[0],
                height: resolution[1]
            }
            globalProject.maxSize = options.maxSize || 100 * 1024 * 1024;
            console.log('globalProject', globalProject)


            TemplateProvider.saveProjectFromGlobal(globalProject);
            ProjectService.saveProjectFromGlobal(globalProject, function () {
                syncServices(globalProject)
                $scope.$broadcast('GlobalProjectReceived');

            });

        }

        function readProjectData() {
            var url = window.location.href
            var url_splices = url.split('/')
            //console.log(url_splices)
            var id = ''
            for (var i = 0; i < url_splices.length; i++) {
                if (url_splices[i] == 'project') {
                    id = url_splices[i + 1]
                    //console.log(id)
                    break
                }
            }
            //window.localStorage.setItem('projectId',id);
            ResourceService.setResourceUrl('/project/' + id + '/resources/');
            ResourceService.setMaskUrl('/project/' + id + '/mask/');

            $http({
                method: 'GET',
                url: baseUrl + '/project/' + id + '/content' + (window.location.search || '')
            }).success(function (data) {
                LoadWithTemplate(data, id);

            }).error(function (msg) {
                toastr.warning('读取错误');
                loadFromBlank({}, id);
            })

            $scope.$on('LoadUp', function () {

                loadStep++;

                if (loadStep == 6) {
                    //到达第8步,加载完成
                    showIDE();
                }
            })
        }

        function showIDE() {
            $timeout(function () {
                $scope.ide.loaded = true;
                window.spinner && window.spinner.hide(true);
            }, 200)
        }

        // function getUrlParams() {
        //     var result = {};
        //     var params = (window.location.search.split('?')[1] || '').split('&');
        //     for (var param in params) {
        //         if (params.hasOwnProperty(param)) {
        //             var paramParts = params[param].split('=');
        //             result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
        //         }
        //     }
        //     console.log(result);
        //     return result;
        // }

        function reLogin(_callback, _errCallback) {
            $http({
                    method: 'GET',
                    url: baseUrl + '/refreshToken',
                    params: {
                        token: window.localStorage.getItem('token')
                    }
                }
            ).success(function (result) {

                if (result.status != 'success') {
                    return;
                }
                console.log(result);
                var token = result.newToken;
                window.localStorage.setItem('token', token);
                TOKEN = token;
                console.log(TOKEN);
                //
                // var pid=result.user.projects[0].pid;
                // PID=pid;

                _callback && _callback();
            }).error(function (err) {
                _errCallback && _errCallback(err);
            });
        }

        function refreshLoginStatus() {
            if (!window.local) {
                var isLogin = true
                setInterval(function () {
                    $http({
                        method: 'GET',
                        url: baseUrl + '/api/refreshlogin'
                    }).success(function (data) {
                        if(!isLogin){
                            toastr.info('重新登录成功')
                        }
                    }).error(function (err) {
                        toastr.warning('已退出登录或者已经离线')
                    });
                }, 10 * 60 * 1000)
            }

        }

        function receiveProject(pid) {

            var globalProject = {};
            if (!pid) {
                $timeout(function () {
                    toastr.info('加载离线项目');
                    globalProject = GlobalService.getBlankProject();
                    TemplateProvider.saveProjectFromGlobal(globalProject);
                    ProjectService.saveProjectFromGlobal(globalProject, function () {
                        PID = pid;

                        //TODO:初始化资源,tags

                        syncServices(globalProject);

                        $scope.$broadcast('GlobalProjectReceived');

                    });
                })

                logs.push('打开本地项目');
                return;
            }
            console.log(TOKEN);

            var globalProjectString = '';
            getProjectData();


            function getProjectData(_dataIndex) {
                $http({
                    method: 'GET',
                    url: baseUrl + '/project',
                    params: {
                        token: window.localStorage.getItem('token'),

                        pid: pid

                    }
                }).success(function (r) {

                    console.log(r);

                    var status = r.status;
                    if (status == 'success') {
                        globalProject = r.project.data;

                        if (globalProject) {

                            TemplateProvider.saveProjectFromGlobal(globalProject);
                            ProjectService.saveProjectFromGlobal(globalProject, function () {
                                PID = pid;

                                //TODO:初始化资源,tags

                                syncServices(globalProject);

                                $scope.$broadcast('GlobalProjectReceived');
                                logs.push('从服务器获取项目');

                            });

                        } else {
                            console.log('获取信息失败');

                            readCache();
                        }


                    }
                    else {
                        console.log('获取信息失败');

                        readCache();
                    }
                }).error(function (msg) {
                    console.log(msg);
                    readCache();

                })
            }
        }

        /**
         * 接收打开的项目并且通知其他controller获取
         */
        function receiveGlobalProject() {
            if (offLine) {
                receiveProject();

            } else {
                reLogin(function () {
                    var pid = PID;
                    receiveProject(pid);
                }, function (err) {
                    console.log(err);
                    readCache();

                })
            }


            // $timeout(function () {
            //     //TODO:以后按照需要选择
            //     var globalProject=GlobalService.getBlankProject();
            //     TemplateProvider.saveProjectFromGlobal(globalProject);
            //     ProjectService.saveProjectFromGlobal(globalProject, function () {
            //         $scope.$broadcast('GlobalProjectReceived');
            //
            //     });
            // },1000);

            //当其他Controller渲染各自作用域后,传来一个事件,用来驱动loadStep
            $scope.$on('LoadUp', function () {

                loadStep++;
                if (loadStep == 6) {
                    //到达第8步,加载完成
                    $timeout(function () {
                        $scope.ide.loaded = true;

                        // intervalSave();

                    }, 2000)
                }
            })

        }

        /**
         * 当创建,切换或修改page,通知更新预览图和舞台区
         */
        function listenChange() {

            $scope.$on('ChangePageNode', function () {
                $scope.$broadcast('PageNodeChanged');
                $scope.$broadcast('NavStatusChanged');
            });

            $scope.$on('ChangeCurrentPage', function (event, operate, callback) {
                $scope.$broadcast('CurrentPageChanged', operate, callback);
                $scope.$broadcast('NavStatusChanged');
                $scope.$broadcast('AttributeChanged');

                document.getElementById("saveFlag").value = "false";//一表示表单值已经被修改过，未save
            });

            $scope.$on('ChangeCurrentSubLayer', function (event, operate, callback) {
                $scope.$broadcast('CurrentSubLayerChanged', operate, callback);
                $scope.$broadcast('NavStatusChanged');
                $scope.$broadcast('AttributeChanged');
            });

            $scope.$on('SwitchCurrentPage', function (event, oldOperate, callback) {
                $scope.$broadcast('PageChangedSwitched', oldOperate, callback);
                $scope.$broadcast('NavStatusChanged');
                $scope.$broadcast('AttributeChanged');
            });

            $scope.$on('ChangeToolShow', function (event, toolShow) {
                $scope.$broadcast('ToolShowChanged', toolShow);
                $scope.$broadcast('NavStatusChanged');
            });

            $scope.$on('AddNewPage', function (event, operate, callback) {
                $scope.$broadcast('NewPageAdded', operate, callback);
                $scope.$broadcast('PageNodeChanged');
                $scope.$broadcast('NavStatusChanged');
                $scope.$broadcast('AttributeChanged');
            });

            $scope.$on('changeCanvasScale', function (event, scaleMode) {
                $scope.$broadcast('CanvasScaleChanged', scaleMode);
            });

            $scope.$on('UpdateProject', function (event) {
                $scope.$broadcast('ProjectUpdated');
                document.getElementById("saveFlag").value = "true";//表示以保存
            });

            $scope.$on('Undo', function (event, operate, callback) {
                $scope.$broadcast('OperateQueChanged', operate, callback);
                $scope.$broadcast('NavStatusChanged');
                $scope.$broadcast('PageNodeChanged');
                $scope.$broadcast('AttributeChanged');
                $scope.$broadcast('syncTagSuccess')
                $scope.$broadcast('trackListChanged')
            });

            $scope.$on('Redo', function (event, operate, callback) {
                $scope.$broadcast('OperateQueChanged', operate, callback);
                $scope.$broadcast('NavStatusChanged');
                $scope.$broadcast('PageNodeChanged');
                $scope.$broadcast('AttributeChanged');
                $scope.$broadcast('syncTagSuccess')
                $scope.$broadcast('trackListChanged')
            });

            $scope.$on('DoCopy', function (event) {
                $scope.$broadcast('NavStatusChanged');
            });

            $scope.$on('ResourceUpdate', function () {
                $scope.$broadcast('AttributeChanged');
                $scope.$broadcast('ResourceChanged');
            });

            $scope.$on('ReOpenProject', reOpenProject);

            $scope.$on('ChangeShownArea', function (event, _op) {
                switch (_op) {
                    case 0:
                        $scope.leftShown = !$scope.leftShown;
                        break;
                    case 1:
                        $scope.rightShown = !$scope.rightShown;
                        break;
                    case 2:
                        $scope.bottomShown = !$scope.bottomShown;
                        break;
                }
            });

        }

        //mask  add by tang
        $scope.$on('ChangeMaskStyle', function (event, data) {
            if (typeof data == 'object') {
                $scope.$broadcast('MaskStyle', data);
            } else {
                $scope.$broadcast('MaskView', data)
            }

        });
        $scope.$on('ChangeMaskAttr', function (event, data) {
            $scope.$broadcast('MaskAttr', data);
        });
        $scope.$on('MaskSwitch', function (event, data) {
            $scope.$broadcast('MaskCtrl', data);
            $scope.$broadcast('MaskView', data);
        });
        $scope.$on('MaskUpdate', function (event, data) {
            $scope.$broadcast('ChangeMask', data)
        });

        //matte  add by tang
        $scope.$on('ChangeMatte', function (event) {
            $scope.$broadcast('ChangeMatteAttr');
            $scope.$broadcast('PageNodeChanged');
        });

        $scope.$on('ChangeCurrentTags', function (event) {
            $scope.$broadcast('TagsChanged');
        })

        function reOpenProject(event, pid) {
            $scope.ide.loaded = false;

            loadStep = 0;     //加载到了第几步,共8步

            receiveProject(pid);


        }

        function loadPreference() {
            fabric.FX_DURATION = Preference.FX_DURATION;
        }

        function intervalSave() {
            //缓存项目
            $interval(function () {
                console.log('项目已自动缓存');
                ProjectService.getProjectTo($scope);
                $scope.project.resourceList = ResourceService.getAllResource()
                $scope.project.customTags = TagService.getAllCustomTags()
                $scope.project.timerTags = TagService.getAllTimerTags()
                $scope.project.timers = TagService.getTimerNum()
                $scope.project.tagClasses = TagService.getAllTagClasses()
                var pid = PID;
                console.log($scope.project)
                window.localStorage.setItem('projectCache' + pid, JSON.stringify($scope.project));
            }, 5 * 60 * 1000);

            //保持登录
            //$interval(function () {
            //
            //    console.log('重新登录');
            //    reLogin();
            //},20*60*1000)
        }

        function readCache() {
            try {
                console.log('读取缓存');
                var pid = PID;
                var project = JSON.parse(window.localStorage.getItem('projectCache' + pid));
                var globalProject = project;
                console.log(globalProject);
                TemplateProvider.saveProjectFromGlobal(globalProject);
                ProjectService.saveProjectFromGlobal(globalProject, function () {
                    syncServices(globalProject)
                    $scope.$broadcast('GlobalProjectReceived');

                });
            } catch (e) {
                toastr.info('获取项目失败')
            }

        }

        //sync services like resource service and tag service

        function syncServices(globalProject) {
            ResourceService.setMaxTotalSize(globalProject.maxSize || 100 * 1024 * 1024);
            ResourceService.syncFiles(globalProject.resourceList);
            WaveFilterService.syncWaveFilters(globalProject.waveFilterList);
            TrackService.setTracks(globalProject.trackList||[]);
            //tags tbc
            TagService.syncCustomTags(globalProject.customTags);
            TagService.syncTimerTags(globalProject.timerTags);
            TagService.setTimerNum(globalProject.timerTags.length||0);
            TagService.syncTagClasses(globalProject.tagClasses);
            NavModalCANConfigService.setCANId(globalProject.CANId);
        }

        function setTemplate(date, cb) {
            var template = _.cloneDeep(date);

            //translate src
            var resourceUrl
            if(local){
                resourceUrl = ResourceService.getResourceNWUrl() + path.sep + 'template'+path.sep;
            }else{
                resourceUrl = ResourceService.getResourceUrl() + 'template/';
            }
            var tempSrc = ''
            for (var key in template) {
                if (template[key] instanceof Array) {
                    //resourcelist
                    template[key].forEach(function (item) {

                        tempSrc = item.src && item.src.split('/');
                        tempSrc = tempSrc[tempSrc.length - 1];
                        tempSrc = resourceUrl + tempSrc;
                        item.src = tempSrc;
                    })
                } else {
                    //widget
                    if (template[key].texList) {
                        template[key].texList.forEach(function (tex) {
                            if (tex.slices) {
                                tex.slices.forEach(function (slice) {
                                    if (slice.imgSrc !== '') {
                                        tempSrc = slice.imgSrc && slice.imgSrc.split('/');
                                        tempSrc = tempSrc[tempSrc.length - 1];
                                        tempSrc = resourceUrl + tempSrc;
                                        slice.imgSrc = tempSrc;
                                    }
                                })
                            }
                        })
                    }
                }
            }
            //add template resource to resource list
            ResourceService.setTemplateFiles(template.templateResourcesList);
            //add template attribute to widget
            TemplateProvider.setDefaultWidget(template);


            var templateList = template.templateResourcesList || [];
            var totalNum = templateList.length;
            var coutDown = function (e, resourceObj) {
                if (e.type === 'error') {
                    toastr.warning('图片加载失败: ' + resourceObj.name);
                    resourceObj.complete = false;
                } else {
                    resourceObj.complete = true;
                }
                totalNum--;
                if (totalNum <= 0) {
                    //cb
                    cb && cb();
                }
            };
            //for(var i=0;i<templateList.length;i++){
            //    var curRes = templateList[i];
            //    ResourceService.cacheFileToGlobalResources(curRes, coutDown, coutDown);
            //}
            if (totalNum > 0) {
                templateList.forEach(function (curRes, index) {
                    ResourceService.cacheFileToGlobalResources(curRes, coutDown, coutDown);
                });
            } else {
                cb && cb();
            }


        }

        /**
         * 重新获取资源大小
         */
        function getResourcesSize(id,cb){
            if(local){
                var projectBaseUrl = path.join(__dirname, 'localproject', id);

            }else{
                $http({
                    method: 'GET',
                    url: '/project/' + id + '/resourcesSize'
                })
                    .success(function (data, status, xhr) {
                        resourcesSizeObj = data||{}
                        cb && cb()
                    })
                    .error(function (err) {
                        console.log(err)
                        cb && cb(err)
                    });
            }
            
        }

        /**
         * 预处理并恢复从zip包上传并创建的工程
         * @param rawData
         */

        function preProcessData(rawData, projectId,cb) {
            var newData = _.cloneDeep(rawData),
                i = 0,//循环变量
                index,//第一个timer tag的下标
                tempContentObj = JSON.parse(rawData.content),
                attrArr = [],//属性名数组
                pageNode = new fabric.Canvas('c'),
                subLayerNode = new fabric.Canvas('c1', {renderOnAddRemove: false});
            // var projectId = window.location.pathname.split('/')[2];
            var replaceSep = '/'
            if(local){
                replaceSep = path.sep
            }else{
                replaceSep = '/'
            }
            var replaceProjectId = function (url) {
                if (!url) {
                    return url;
                }
                var urlArr = url.split(replaceSep);
                
                var targetIdx = 2
                for(var i=0;i<urlArr.length;i++){
                    if(urlArr[i]=='resources'){
                        targetIdx = i - 1
                        break
                    }
                }
                urlArr[targetIdx] = projectId;
                return urlArr.join(replaceSep);
            };

            var renderedRes = []
            function addToRenderedRes(url){
                if(!url){
                    return
                }
                for(var i=0;i<renderedRes.length;i++){
                    if(renderedRes[i]==url){
                        return
                    }
                }
                renderedRes.push(url)
            }
            function renderResUrlToRes(){
                return renderedRes.map(function(url){
                    var nameParts = url.split(replaceSep)
                    var name = nameParts[nameParts.length - 1]
                    return {
                        id:name,
                        name:name,
                        src:url,
                        type:'image/png',
                        size:getResSize(name)
                    }
                })
            }
            function getResSize(id){
                return resourcesSizeObj[id]||0
            }

            //fix basic data structure
            newData.thumbnail = '';
            newData.template = '';
            //newData.supportTouch = 'false';

            tempContentObj.currentSize = _.cloneDeep(tempContentObj.size);
            tempContentObj.customTags = _.cloneDeep(tempContentObj.tagList);
            tempContentObj.projectId = projectId
            tempContentObj.initSize = _.cloneDeep(tempContentObj.size);
            tempContentObj.pages = _.cloneDeep(tempContentObj.pageList);
            for (i = 0; i < tempContentObj.tagList.length; i++) {
                if (tempContentObj.tagList[i].type === undefined) {
                    index = i;
                    break;
                }
            }
            tempContentObj.timerTags = index > 0 ? tempContentObj.customTags.splice(index, tempContentObj.customTags.length - index) : [];

            attrArr = ['size', 'tagList', 'basicUrl', 'format', 'name', 'author', 'pageList'];
            deleteObjAttr(tempContentObj, attrArr);

            //then fix page layer sublayer and widget
            i = 0;
            var pageLength = tempContentObj.pages.length;
            var page;
            var ergodicPages = function () {
                page = null;
                page = tempContentObj.pages[i];
                index = i;
                pageNode.setWidth(tempContentObj.initSize.width);
                pageNode.setHeight(tempContentObj.initSize.height);
                pageNode.zoomToPoint(new fabric.Point(0, 0), 1);
                // page.originBackgroundImage = replaceProjectId(page.originBackgroundImage);
                // page.backgroundImage = page.originBackgroundImage;
                page.backgroundImage = replaceProjectId(page.backgroundImage)
                addToRenderedRes(page.backgroundImage)
                if (page.canvasList !== undefined) {
                    page.selected = (index === 0) ? true : false
                    page.layers = page.canvasList;
                    attrArr = ['canvasList', 'linkedAllWidgets'];
                    deleteObjAttr(page, attrArr);
                    if (page.actions) {
                        if(page.originActions){
                            // 1.10.6 生成工程会保存原始指令
                            page.actions = page.originActions;
                            delete page.originActions;
                        }else{
                            page.actions.forEach(function (action) {
                                if (action.commands) {
                                    var newCommands;
                                    newCommands = action.commands.map(function (command) {
                                        return command.cmd;
                                    });
                                    action.commands = newCommands;
                                }
                            })
                        }

                    }
                    page.layers.forEach(function (layer, index) {
                        layer.subLayers = layer.subCanvasList;
                        layer.subLayers.forEach(function (subLayer, index) {
                            subLayer.widgets = subLayer.widgetList;
                            attrArr = ['widgetList'];
                            deleteObjAttr(subLayer, attrArr);
                            subLayerNode.setWidth(layer.w);
                            subLayerNode.setHeight(layer.h);
                            subLayerNode.zoomToPoint(new fabric.Point(0, 0), 1);
                            // subLayerNode.clear();
                            subLayer.current = false;
                            subLayer.expand = true;
                            subLayer.selected = false;
                            subLayer.url = '';
                            if (subLayer.actions) {
                                if(subLayer.originActions){
                                    subLayer.actions = subLayer.originActions;
                                    delete subLayer.originActions;
                                }else{
                                    subLayer.actions.forEach(function (action) {
                                        if (action.commands) {
                                            var newCommands;
                                            newCommands = action.commands.map(function (command) {
                                                return command.cmd;
                                            });
                                            action.commands = newCommands;
                                        }
                                    })
                                }

                            }
                            subLayer.widgets.forEach(function (widget, index) {
                                widget.type = widget.subType;
                                deleteObjAttr(widget, ['subType']);
                                widget.current = false;
                                widget.currentFabwidget = null;
                                widget.expand = true;
                                widget.selected = false;
                                if (widget.actions) {
                                    if(widget.originActions){
                                        widget.actions = widget.originActions;
                                        delete widget.originActions;
                                    }else{
                                        widget.actions.forEach(function (action) {
                                            if (action.commands) {
                                                var newCommands;
                                                newCommands = action.commands.map(function (command) {
                                                    return command.cmd;
                                                });
                                                action.commands = newCommands;
                                            }
                                        })
                                    }

                                }
                                if (widget.texList && (widget.texList instanceof Array)) {
                                    widget.texList.forEach(function (tex, index) {
                                        if (tex.slices && (tex.slices instanceof Array)) {
                                            tex.slices.forEach(function (slice, index) {
                                                if (slice.hasOwnProperty('originSrc')) {
                                                    // slice.originSrc = replaceProjectId(slice.originSrc);
                                                    // slice.imgSrc = slice.originSrc;
                                                    slice.imgSrc = replaceProjectId(slice.imgSrc)
                                                    addToRenderedRes(slice.imgSrc)
                                                    delete slice.originSrc;
                                                }
                                            })
                                        }
                                    })
                                }
                                addWidgetInCurrentSubLayer(widget, subLayerNode);
                            });
                            subLayer.proJsonStr = subLayerNode.toJSON();
                            subLayerNode.clear();
                        });
                        layer.info = {};
                        layer.info.width = layer.w;
                        layer.info.height = layer.h;
                        layer.info.top = layer.y;
                        layer.info.left = layer.x;
                        layer.zIndex = index;
                        layer.current = false;
                        layer.expand = true;
                        layer.selected = false;
                        layer.showSubLayer = layer.subLayers[0];
                        layer.url = '';
                        attrArr = ['w', 'h', 'y', 'x', 'subCanvasList'];
                        deleteObjAttr(layer, attrArr);
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
                                    tempContentObj.resourceList = renderResUrlToRes()
                                    newData.content = JSON.stringify(tempContentObj);
                                    // console.log('after preprocess',newData);
                                    cb && cb(newData)
                                }
                            });
                        }, {
                            width: tempContentObj.initSize.width,
                            height: tempContentObj.initSize.height
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
                                    tempContentObj.resourceList = renderResUrlToRes()
                                    newData.content = JSON.stringify(tempContentObj);
                                    // console.log('after preprocess',newData);
                                    cb && cb(newData)
                                }
                            });
                        });
                    }
                }
            };
            ergodicPages();
        }


        /**
         * 删除一个对象中的指定的属性
         * @param obj 对象
         * @param attrArr 属性名称组成的数组
         */
        function deleteObjAttr(obj, attrArr) {
            if (attrArr instanceof Array) {
                attrArr.forEach(function (key, index) {
                    delete obj[key];
                })
            }
            return obj
        }

        /**
         * 将widget加入sublayer
         * @param dataStructure
         * @param node
         * @param _successCallback
         */
        function addWidgetInCurrentSubLayer(dataStructure, node, _successCallback) {
            preProcessWidget(dataStructure);
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

            // switch (dataStructure.type) {
            //     case 'MySlide':
            //         fabric.MySlide.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyProgress':
            //         fabric.MyProgress.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyDashboard':
            //         fabric.MyDashboard.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyButton':
            //         fabric.MyButton.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyButtonGroup':
            //         fabric.MyButtonGroup.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyNumber':
            //         fabric.MyNumber.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyTextArea':
            //         fabric.MyTextArea.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyKnob':
            //         fabric.MyKnob.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyOscilloscope':
            //         fabric.MyOscilloscope.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MySwitch':
            //         fabric.MySwitch.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyRotateImg':
            //         fabric.MyRotateImg.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyDateTime':
            //         fabric.MyDateTime.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyScriptTrigger':
            //         fabric.MyScriptTrigger.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyVideo':
            //         fabric.MyVideo.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyAnimation':
            //         fabric.MyAnimation.fromLevel(dataStructure, addFabWidget, initiator);
            //         break;
            //     case 'MyLayer':
            //         node.add(new fabric.MyLayer(dataStructure, initiator));
            //         break;
            //     case 'MyNum':
            //         node.add(new fabric.MyNum(dataStructure, initiator));
            //         break;
            //     case 'MyTexNum':
            //         node.add(new fabric.MyTexNum(dataStructure, initiator));
            //         break;
            //     case 'MyTexTime':
            //         node.add(new fabric.MyTexTime(dataStructure, initiator));
            //         break;
            //     default :
            //         console.error('not match widget in preprocess!');
            //         break;
            // }
            if(dataStructure.type){
                // fabric[dataStructure.type].fromLevel(dataStructure, addFabWidget, initiator);
                node.add(new fabric[dataStructure.type](dataStructure, initiator));
            }
        };
        /**
         * 在绘制生成proJsonStr之前的兼容处理
         * @param widget
         */
        function preProcessWidget(widget) {
            switch (widget.type) {
                case 'MyTexNum':
                    if (widget.info.numSystem === undefined || widget.info.hexControl === undefined) {
                        widget.info.numSystem = '0';
                        widget.info.hexControl = {
                            markingMode: '0',
                            transformMode: '0'
                        }
                    }
                    var slices = widget.texList[0].slices;
                    if (slices.length < 27) {
                        var hexTex = ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F','——'];
                        for (var i = 0; i < hexTex.length; i++) {
                            var n = i + 13;
                            slices[n] = {};
                            slices[n].imgSrc = '';
                            slices[n].color = 'rgba(120,120,120,1)';
                            slices[n].name = hexTex[i];
                        }
                    }
                    break;
                case 'MyNum':
                    if (widget.info.numSystem === undefined || widget.info.hexControl === undefined) {
                        widget.info.numSystem = '0';
                        widget.info.hexControl = {
                            markingMode: '0',
                            transformMode: '0'
                        }
                    }
                    break;
                default :
                    break;
            }
        }

        var toastrOptsBackup = {}
        function saveToastrOpts(){
            toastrOptsBackup =  {
                timeOut:toastr.options.timeOut,
                extendedTimeOut:toastr.options.extendedTimeOut,
                closeButton:toastr.options.closeButton
            }
        }
        function restoreToastrOpts(){
            Object.assign(toastr.options,toastrOptsBackup)
        }

        /**
         * 初始化socket
         */
        $scope.wrapperForCoop = false;
        $scope.projectOwner = false;
        var inCharge = false;

        function initSocketIO(ownerId) {
            console.log('init socket io')
            socketIOService.createSocket('', function (data) {

                console.log('you have connect');

                socketIOService.on('serverRoom:enter',function(user){
                    // console.log('new user',user)
                })

                socketIOService.on('serverRoom:newMsg',function(msg){
                    saveToastrOpts()
                    toastr.options.closeButton = true
                    toastr.options.timeOut = 0;
                    toastr.options.extendedTimeOut = 0;
                    toastr.warning(msg,'公告')
                    restoreToastrOpts()
                })


                window.emitMsg = function(msg){socketIOService.emit('serverRoom:newMsg',msg)}

                //capture current users in room
                socketIOService.on('connect:success', function (allUsers, currentUser) {
                    // console.log('connect:success',allUsers);
                    socketIOService.setRoomUsers(allUsers);
                    $scope.currentUser = currentUser;
                    inCharge = allUsers[0] && (allUsers[0].id === $scope.currentUser.id);
                    if (!inCharge) {
                        console.log('wenerId', ownerId, 'currId', currentUser.id);
                        $scope.projectOwner = (ownerId === currentUser.id);
                        $scope.wrapperForCoop = true;
                        $scope.currentUsers = socketIOService.getRoomUsers();
                    }
                });


                //capture new user enter this room
                socketIOService.on("user:enter", function (data) {
                    toastr.info('用户 ' + data.username + '加入');
                    $scope.$apply(function () {
                        $scope.currentUsers = socketIOService.addUserInRoom(data);
                        // console.log('add user',$scope.currentUsers);
                    })
                });

                //capture user leave this room
                socketIOService.on("user:leave", function (data) {
                    toastr.info('用户 ' + data.username + ' 已离开');
                    $scope.$apply(function () {
                        $scope.currentUsers = socketIOService.deleteUserInRoom(data);
                    });

                    //check currentUser have right to edit project
                    // console.log('inCharge',inCharge);
                    if (!inCharge) {
                        inCharge = $scope.currentUsers[0] && ($scope.currentUsers[0].id === $scope.currentUser.id);
                        $timeout(function () {
                            if (inCharge) {
                                alert('您已获得编辑工程的权限，即将重新加载工程');
                                window.spinner && window.spinner.show();
                                $scope.wrapperForCoop = false;
                                loadStep = 0;
                                readProjectData();
                            }
                        }, 1500)
                    }
                });


                //capture room close
                socketIOService.on('room:close', function () {
                    toastr.warning('管理员已经关闭共享，页面即将关闭');
                    socketIOService.closeSocket(function () {
                        setTimeout(function () {
                            closeWebPage();
                        }, 1000)
                    })
                })
            });

        }

        $scope.openSimulator = function () {
            $scope.$broadcast('OpenSimulator')
        };

        $scope.cancelShare = function () {
            if (confirm('强制取消将对正在编辑的工程产生影响，确定取消分享？')) {
                var arr = window.location.href.split('/');
                var id = arr[arr.length - 2];
                console.log('id', id);
                $http({
                    method: 'POST',
                    url: '/project/' + id + '/share',
                    data: {
                        share: false
                    }
                })
                    .success(function (data, status, xhr) {
                        socketIOService.emit('room:close');
                        socketIOService.closeSocket();
                        toastr.info('取消成功,工程即将重新加载!');
                        setTimeout(function () {
                            window.spinner && window.spinner.show();
                            $scope.wrapperForCoop = false;
                            loadStep = 0;
                            readProjectData();
                        }, 1500);

                    })
                    .error(function (err) {
                        console.log(err)
                    });
            }
        };

        $scope.$on('createSocketIO', function () {
            console.log('open share then create socketIO');
            //initSocketIO();
        });

        $scope.$on('closeSocketIO', function () {
            console.log('close share then close socketIO');
            socketIOService.emit('room:close');
            // socketIOService.closeSocket();
        });


        function closeWebPage() {
            if (navigator.userAgent.includes("MSIE")) {
                if (navigator.userAgent.includes("MSIE 6.0")) {
                    window.opener = null;
                    window.close();
                } else {
                    window.open('', '_top');
                    window.top.close();
                }
            }
            else if (navigator.userAgent.includes("Firefox")) {
                window.location.href = 'about:blank ';
            } else {
                window.opener = null;
                window.open('', '_self', '');
                window.close();
            }
        }
    }]);