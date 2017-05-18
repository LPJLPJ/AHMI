/**
 * Created by shenaolin on 16/2/26.
 */
var ide=angular.module('ide',['ui.bootstrap.contextMenu','colorpicker.module','ui.sortable','btford.modal','ui.bootstrap','ngAnimate','GlobalModule','ui.tree','IDEServices']);


ide.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension|chrome-extension):/);
    }]);

var baseUrl='';

var PID='';
var TOKEN='';

var MAX_DATA_LENGTH=100000;

var ideScope;
var isOffline;
var mode = 'DEBUG';

console.log = (function (console) {
    if (mode === 'DEBUG'){
        return console.log;
    }else{
        console.oldLog = console.log;
        return function () {
        }
    }
})(console);


var logs=[];
ide.controller('IDECtrl', [ '$scope','$timeout','$http','$interval', 'ProjectService', 'GlobalService', 'Preference', 'ResourceService', 'TagService', 'TemplateProvider','TimerService','UserTypeService','WidgetService','NavModalCANConfigService',
    function ($scope,$timeout,$http,$interval,
                                    ProjectService,
                                    GlobalService,
                                    Preference,
                                    ResourceService,
                                    TagService,
                                    TemplateProvider,TimerService,UserTypeService,WidgetService,NavModalCANConfigService) {

    ideScope=$scope;
    $scope.ide={
        loaded:false    //页面是否渲染完成
    };

    var loadStep=0;     //加载到了第几步,共8步
    var fs,path,__dirname;

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

    function initUI(){
        $scope.leftShown=true;
        $scope.rightShown=true;
        $scope.bottomShown=true;

        try {
            var os = require('os');
            if (os){

                window.local = true;
                $scope.local = true;
                window.ondragover = function(e){
                    e.preventDefault();
                    return false;
                }
                window.ondrop = function(e){
                    e.preventDefault();
                    return false
                }
                __dirname = global.__dirname;
                path = require('path');
                fs = require('fs');

            }
        }catch (e){
            window.local = false;
        }
    }

    function loadProject() {
        if (window.local){
            readLocalProjectData();
        }else{
            readProjectData();
        }

    }

    function readUserType(){
        var userType = 'basic';
        if(window.local){
            var userInfoUrl = path.join(__dirname,'public','nw','userInfo.json');
            var userInfo = {
                name:'',
                type:'basic'
            };
            if(!fs.existsSync(userInfoUrl)){
                fs.writeFileSync(userInfoUrl,JSON.stringify(userInfo));
            }
            var data = JSON.parse(fs.readFileSync(userInfoUrl,'utf-8'));
            userType = data.type;
        }else{
            userType=localStorage.getItem('userType');
        }
        UserTypeService.setUserType(userType);
    }

    function readLocalProjectData() {
        var url = window.location.href;
        var projectId = url.split('?')[1].split('=')[1];
        if (projectId[projectId.length - 1] === '#') {
            projectId = projectId.slice(0, -1);
        }
        console.log(projectId);
        //load projectId project
        var projectBaseUrl = path.join(__dirname,'localproject',projectId);
        ResourceService.setProjectUrl(projectBaseUrl);
        var resourceUrl = path.join(projectBaseUrl, 'resources');
        ResourceService.setResourceUrl(resourceUrl);
        var realDirPath = path.join(__dirname, path.dirname(window.location.pathname));

        ResourceService.setResourceNWUrl(path.relative(realDirPath, resourceUrl));
        console.log(path.relative(realDirPath, resourceUrl));
        var data = readSingleFile(path.join(projectBaseUrl,'project.json'));

        $timeout(function () {
            if (data){
                data = JSON.parse(data);
                loadFromContent(data,projectId);
            }else{
                loadFromBlank({},projectId);
            }
        },0);
       

        $scope.$on('LoadUp', function () {

            loadStep++;
            if (loadStep == 6) {
                //到达第8步,加载完成
                showIDE();
            }
        })
        

    }

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



    function LoadWithTemplate(data, id){
        var templateId = data.template;
        //add templateId to template
        TemplateProvider.setTemplateId(templateId);
        if (templateId && templateId!==''){
            $http({
                method:'GET',
                url:'/public/templates/defaultTemplate/defaultTemplate.json'
            }).success(function (tdata) {
                //console.log('get json success',tdata);
                setTemplate(tdata,function(){
                    loadFromContent(data,id);
                }.bind(this));
            }).error(function (msg) {
                //toastr.warning('读取错误');
                //loadFromBlank({},id);
                console.log('get json failed');
            })
        }else{
            loadFromContent(data,id);
        }


    }

    function loadFromContent(data,id) {
        //$http({
        //    method:'GET',
        //    url:'/public/templates/defaultTemplate/defaultTemplate.json'
        //}).success(function (data) {
        //    console.log('get json success',data);
        //    setTemplate(data);
        //}).error(function (msg) {
        //    //toastr.warning('读取错误');
        //    //loadFromBlank({},id);
        //    console.log('get json failed');
        //})


        if (data.content){

            //var globalProject = GlobalService.getBlankProject()
            var globalProject = JSON.parse(data.content);
            var resolution = data.resolution.split('*').map(function (r) {
                return Number(r)
            });
            globalProject.initSize = {
                width : resolution[0],
                height :resolution[1]
            }
            globalProject.currentSize = {
                width : resolution[0],
                height :resolution[1]
            }
            globalProject.maxSize = data.maxSize;

            globalProject.projectId = id;


            //console.log('globalProject',globalProject);

            var resourceList = globalProject.resourceList;
            console.log('resourceList',resourceList);
            var count = resourceList.length;
            var globalResources = ResourceService.getGlobalResources();
            window.globalResources = globalResources;

            var coutDown = function (e, resourceObj) {
                if (e.type === 'error'){
                    // console.log(e)
                    toastr.warning('图片加载失败: ' + resourceObj.name);
                    resourceObj.complete = false;
                } else {
                    resourceObj.complete = true;
                }
                count = count - 1;
                if (count<=0){
                    // toastr.info('loaded');
                    TemplateProvider.saveProjectFromGlobal(globalProject);
                    syncServices(globalProject);
                    ProjectService.saveProjectFromGlobal(globalProject, function () {

                        $scope.$broadcast('GlobalProjectReceived');

                    });
                }
            }.bind(this);
            if (count>0){
                for (var i=0;i<resourceList.length;i++){
                    var curRes = resourceList[i];
                    console.log('caching ',i)
                    ResourceService.cacheFileToGlobalResources(curRes, coutDown, coutDown);
                }
            }else{
                console.log(globalProject);
                TemplateProvider.saveProjectFromGlobal(globalProject);
                syncServices(globalProject)
                ProjectService.saveProjectFromGlobal(globalProject, function () {

                    $scope.$broadcast('GlobalProjectReceived');

                });
            }



            //readCache();
        }else{
            //console.log('获取信息失败');
            //
            //readCache();

            globalProject = GlobalService.getBlankProject()
            globalProject.projectId = id;
            //change resolution
            //console.log(data);
            var resolution = data.resolution.split('*').map(function (r) {
                return Number(r)
            })
            globalProject.initSize = {
                width : resolution[0],
                height :resolution[1]
            }
            globalProject.currentSize = {
                width : resolution[0],
                height :resolution[1]
            }
            globalProject.maxSize = data.maxSize;
            console.log('globalProject new',_.cloneDeep(globalProject));


            TemplateProvider.saveProjectFromGlobal(globalProject);
            syncServices(globalProject)
            ProjectService.saveProjectFromGlobal(globalProject, function () {

                $scope.$broadcast('GlobalProjectReceived');

            });
        }
    }

    function loadFromBlank(options,id) {
        var globalProject = GlobalService.getBlankProject()
        globalProject.projectId = id;
        //change resolution
        var resolution = (options.resolution||'800*480').split('*').map(function (r) {
            return Number(r)
        })
        globalProject.initSize = {
            width : resolution[0],
            height :resolution[1]
        }
        globalProject.currentSize = {
            width : resolution[0],
            height :resolution[1]
        }
        globalProject.maxSize = options.maxSize||100*1024*1024;
        console.log('globalProject',globalProject)


        TemplateProvider.saveProjectFromGlobal(globalProject);
        ProjectService.saveProjectFromGlobal(globalProject, function () {
            syncServices(globalProject)
            $scope.$broadcast('GlobalProjectReceived');

        });

    }

    function readProjectData(){
        var url = window.location.href
        var url_splices = url.split('/')
        //console.log(url_splices)
        var id = ''
        for (var i=0;i<url_splices.length;i++){
            if (url_splices[i] == 'project'){
                id = url_splices[i+1]
                //console.log(id)
                break
            }
        }
        //window.localStorage.setItem('projectId',id);
        ResourceService.setResourceUrl('/project/'+id+'/resources/')

        $http({
            method:'GET',
            url:baseUrl+'/project/'+id+'/content'
        }).success(function (data) {
            LoadWithTemplate(data,id);

        }).error(function (msg) {
            toastr.warning('读取错误');
            loadFromBlank({},id);
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
            $scope.ide.loaded=true;
            window.spinner && window.spinner.hide();
            // intervalSave();

        },200)
    }

    function getUrlParams() {
        var result = {};
        var params = (window.location.search.split('?')[1] || '').split('&');
        for(var param in params) {
            if (params.hasOwnProperty(param)) {
                var paramParts = params[param].split('=');
                result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
            }
        }
        console.log(result);
        return result;
    }

    function reLogin(_callback,_errCallback) {
        $http({
                method:'GET',
                url:baseUrl+'/refreshToken',
                params:{
                    token:window.localStorage.getItem('token')
                }
            }
        ).success(function (result) {

            if (result.status!='success'){
                return;
            }
            console.log(result);
            var token=result.newToken;
            window.localStorage.setItem('token',token);
            TOKEN=token;
            console.log(TOKEN);
            //
            // var pid=result.user.projects[0].pid;
            // PID=pid;

            _callback&&_callback(result);
        }).error(function (err) {
            _errCallback&&_errCallback(err);
        });
    };

    function refreshLoginStatus() {
        if (!window.local) {
            setInterval(function () {
                $http({
                    method: 'GET',
                    url: baseUrl + '/api/refreshlogin'
                }).success(function (data) {
                    console.log(data);
                }).error(function (err) {
                    console.log(err)
                });
            }, 10 * 60 * 1000)
        }

    }

    function receiveProject(pid) {

        var globalProject={};
        if (!pid){
            $timeout(function () {
                toastr.info('加载离线项目');
                globalProject=GlobalService.getBlankProject();
                TemplateProvider.saveProjectFromGlobal(globalProject);
                ProjectService.saveProjectFromGlobal(globalProject, function () {
                    PID=pid;

                    //TODO:初始化资源,tags

                    syncServices(globalProject);

                    $scope.$broadcast('GlobalProjectReceived');

                });
            })

            logs.push('打开本地项目');
            return;
        }
        console.log(TOKEN);

        var globalProjectString='';
        getProjectData();


        
        function getProjectData(_dataIndex) {
            $http({
                method:'GET',
                url:baseUrl+'/project',
                params:{
                    token:window.localStorage.getItem('token'),

                    pid:pid

                }
            }).success(function (r) {

                console.log(r);

                var status=r.status;
                if (status=='success')
                {
                    globalProject=r.project.data;

                    if (globalProject){

                        TemplateProvider.saveProjectFromGlobal(globalProject);
                        ProjectService.saveProjectFromGlobal(globalProject, function () {
                            PID = pid;

                            //TODO:初始化资源,tags

                            syncServices(globalProject);

                            $scope.$broadcast('GlobalProjectReceived');
                            logs.push('从服务器获取项目');

                        });

                    }else{
                        console.log('获取信息失败');

                        readCache();
                    }


                }
                else{
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
    function receiveGlobalProject(){
        if(offLine){
            receiveProject();

        }else {
            reLogin(function () {
                var pid=PID;
                receiveProject(pid);
            },function (err) {
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
                    $scope.ide.loaded=true;

                    // intervalSave();

                },2000)
            }
        })

    }

    /**
     * 当创建,切换或修改page,通知更新预览图和舞台区
     */
    function listenChange(){

        $scope.$on('ChangePageNode', function () {
            $scope.$broadcast('PageNodeChanged');
            $scope.$broadcast('NavStatusChanged');
        });

        $scope.$on('ChangeCurrentPage', function (event,operate,callback) {
            $scope.$broadcast('CurrentPageChanged',operate,callback);
            $scope.$broadcast('NavStatusChanged');
            $scope.$broadcast('AttributeChanged');

            document.getElementById("saveFlag").value = "false";//一表示表单值已经被修改过，未save
        });

        $scope.$on('ChangeCurrentSubLayer', function (event,operate, callback) {
            $scope.$broadcast('CurrentSubLayerChanged',operate,callback);
            $scope.$broadcast('NavStatusChanged');
            $scope.$broadcast('AttributeChanged');
        })

        $scope.$on('SwitchCurrentPage', function (event,oldOperate,callback) {
            $scope.$broadcast('PageChangedSwitched',oldOperate,callback);
            $scope.$broadcast('NavStatusChanged');
            $scope.$broadcast('AttributeChanged');


        })

        $scope.$on('ChangeToolShow', function (event, toolShow) {
            $scope.$broadcast('ToolShowChanged',toolShow);
            $scope.$broadcast('NavStatusChanged');


        });
        $scope.$on('AddNewPage', function (event, operate, callback) {
            $scope.$broadcast('NewPageAdded',operate, callback);
            $scope.$broadcast('PageNodeChanged');
            $scope.$broadcast('NavStatusChanged');
            $scope.$broadcast('AttributeChanged');


        });

        $scope.$on('changeCanvasScale', function (event,scaleMode) {
            $scope.$broadcast('CanvasScaleChanged',scaleMode);
        });

        $scope.$on('UpdateProject', function (event) {
            $scope.$broadcast('ProjectUpdated');

            document.getElementById("saveFlag").value = "true";//表示以保存
        });



        $scope.$on('Undo', function (event, operate, callback) {
            $scope.$broadcast('OperateQueChanged',operate,callback);
            $scope.$broadcast('NavStatusChanged');
            $scope.$broadcast('PageNodeChanged');
            $scope.$broadcast('AttributeChanged');
        });
        $scope.$on('Redo', function (event, operate, callback) {
            $scope.$broadcast('OperateQueChanged',operate,callback);
            $scope.$broadcast('NavStatusChanged');
            $scope.$broadcast('PageNodeChanged');
            $scope.$broadcast('AttributeChanged');
        });

        $scope.$on('DoCopy', function (event) {
            $scope.$broadcast('NavStatusChanged');
        });

        $scope.$on('ResourceUpdate',function(){
            $scope.$broadcast('AttributeChanged');
            $scope.$broadcast('ResourceChanged');
        });

        $scope.$on('ReOpenProject',reOpenProject);


        $scope.$on('ChangeShownArea', function (event, _op) {
            console.log(_op);
            switch (_op){
                case 0:$scope.leftShown=!$scope.leftShown;break;
                case 1:$scope.rightShown=!$scope.rightShown;break;
                case 2:$scope.bottomShown =!$scope.bottomShown;break;

            }
        })
    }

    function reOpenProject(event,pid) {
        $scope.ide.loaded=false;

        loadStep=0;     //加载到了第几步,共8步

        receiveProject(pid);



    }
    function loadPreference(){
        fabric.FX_DURATION=Preference.FX_DURATION;
    }


    function intervalSave(){
        //缓存项目
        $interval(function () {
            console.log('项目已自动缓存');
            ProjectService.getProjectTo($scope);
            $scope.project.resourceList = ResourceService.getAllResource()
            $scope.project.customTags = TagService.getAllCustomTags()
            $scope.project.timerTags = TagService.getAllTimerTags()
            $scope.project.timers = TagService.getTimerNum()
            var pid=PID;
            console.log($scope.project)
            window.localStorage.setItem('projectCache'+pid,JSON.stringify($scope.project));
        },5*60*1000);

        //保持登录
        //$interval(function () {
        //
        //    console.log('重新登录');
        //    reLogin();
        //},20*60*1000)
    }

    function readCache() {
        try{
            console.log('读取缓存');
            var pid=PID;
            var project=JSON.parse(window.localStorage.getItem('projectCache'+pid));
            var globalProject=project;
            console.log(globalProject);
            TemplateProvider.saveProjectFromGlobal(globalProject);
            ProjectService.saveProjectFromGlobal(globalProject, function () {
                syncServices(globalProject)
                $scope.$broadcast('GlobalProjectReceived');

            });
        }catch (e){
            toastr.info('获取项目失败')
        }

    }

    //sync services like resource service and tag service

    function syncServices(globalProject){
        ResourceService.setMaxTotalSize(globalProject.maxSize||100*1024*1024);
        ResourceService.syncFiles(globalProject.resourceList);
        //tags tbc
        TagService.syncCustomTags(globalProject.customTags);
        TagService.syncTimerTags(globalProject.timerTags);
        TagService.setTimerNum(globalProject.timers);
        NavModalCANConfigService.setCANId(globalProject.CANId);
    }

    function setTemplate(date,cb){
        var template = _.cloneDeep(date);

        //translate src
        var resourceUrl = ResourceService.getResourceUrl()+'template/';
        var tempSrc = ''
        for(var key in template){
            if(template[key] instanceof Array){
                //resourcelist
                template[key].forEach(function(item){
                    tempSrc = item.src&&item.src.split('/');
                    tempSrc = tempSrc[tempSrc.length-1];
                    tempSrc = resourceUrl + tempSrc;
                    item.src = tempSrc;
                })
            }else{
                //widget
                if(template[key].texList){
                    template[key].texList.forEach(function(tex){
                        if(tex.slices){
                            tex.slices.forEach(function(slice){
                                tempSrc = slice.imgSrc&&slice.imgSrc.split('/');
                                tempSrc = tempSrc[tempSrc.length-1];
                                tempSrc = resourceUrl+tempSrc;
                                slice.imgSrc = tempSrc;
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



        var templateList = template.templateResourcesList||[];
        var totalNum = templateList.length;
        var coutDown = function (e, resourceObj) {
            if (e.type === 'error') {
                toastr.warning('图片加载失败: ' + resourceObj.name);
                resourceObj.complete = false;
            } else {
                resourceObj.complete = true;
            }
            totalNum--;
            if(totalNum<=0){
                //cb
                cb && cb();
            }
        };
        //for(var i=0;i<templateList.length;i++){
        //    var curRes = templateList[i];
        //    ResourceService.cacheFileToGlobalResources(curRes, coutDown, coutDown);
        //}
        if(totalNum>0){
            templateList.map(function(curRes,index){
                ResourceService.cacheFileToGlobalResources(curRes, coutDown, coutDown);
            });
        }else{
            cb && cb();
        }


    }


}]);