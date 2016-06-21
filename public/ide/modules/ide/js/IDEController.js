/**
 * Created by shenaolin on 16/2/26.
 */
var ide=angular.module('ide',['ui.bootstrap.contextMenu','colorpicker.module','btford.modal','ui.bootstrap','ngAnimate','GlobalModule','ui.tree','IDEServices']);

var baseUrl='';

var PID='';
var TOKEN='';

var MAX_DATA_LENGTH=100000;

var ideScope;
var isOffline;


var logs=[];
ide.controller('IDECtrl', function ($scope,$timeout,$http,$interval,
                                    ProjectService,
                                    GlobalService,
                                    Preference,
                                    ResourceService,
                                    TagService,
                                    TemplateProvider,TimerService) {

    ideScope=$scope;
    $scope.ide={
        loaded:false    //页面是否渲染完成
    };

    var loadStep=0;     //加载到了第几步,共8步

    


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

    readProjectData();

    //receiveGlobalProject();

    listenChange();

    loadPreference();

    function initUI(){
        $scope.leftShown=true;
        $scope.rightShown=true;
        $scope.bottomShown=true;
    }


    function readProjectData(){
        var url = window.location.href
        //console.log(url)
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
        console.log(id)
        //window.localStorage.setItem('projectId',id);
        ResourceService.setResourceUrl('/project/'+id+'/resources/')

        $http({
            method:'GET',
            url:baseUrl+'/project/'+id+'/content'
        }).success(function (data) {
            console.log(data)
            if (data.content){
                //console.log(data)

                //var globalProject = GlobalService.getBlankProject()
                var globalProject = JSON.parse(data.content)
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

                globalProject.projectId = id;


                console.log('globalProject',globalProject)

                TemplateProvider.saveProjectFromGlobal(globalProject);
                ProjectService.saveProjectFromGlobal(globalProject, function () {
                    syncServices(globalProject)
                    console.log(globalProject);
                    $scope.$broadcast('GlobalProjectReceived');

                });

                //readCache();
            }else{
                //console.log('获取信息失败');
                //
                //readCache();
                console.log(data)
                globalProject = GlobalService.getBlankProject()
                globalProject.projectId = id;
                //change resolution
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
                console.log('globalProject',globalProject)

                TemplateProvider.saveProjectFromGlobal(globalProject);
                ProjectService.saveProjectFromGlobal(globalProject, function () {
                    syncServices(globalProject)
                    $scope.$broadcast('GlobalProjectReceived');

                });
            }
        }).error(function (msg) {
            console.log(msg);
            readCache();

        })

        $scope.$on('LoadUp', function () {

            loadStep++;
            if (loadStep==8){
                //到达第8步,加载完成
                $timeout(function () {
                    $scope.ide.loaded=true;

                    intervalSave();

                },2000)
            }
        })
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
            if (loadStep==8){
                //到达第8步,加载完成
                $timeout(function () {
                    $scope.ide.loaded=true;

                    intervalSave();

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
            $scope.project.timers = TimerService.getTimerNum()
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
        ResourceService.syncFiles(globalProject.resourceList)
        //tags tbc
        TagService.syncCustomTags(globalProject.customTags)
        TagService.syncTimerTags(globalProject.timerTags)
        TimerService.setTimerNum(globalProject.timers)
    }


});