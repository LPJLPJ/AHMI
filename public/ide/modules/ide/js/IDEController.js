/**
 * Created by shenaolin on 16/2/26.
 */
var ide=angular.module('ide',['ui.bootstrap.contextMenu','colorpicker.module','btford.modal','ui.bootstrap','ngAnimate','GlobalModule','ui.tree','IDEServices']);

//var baseUrl='http://192.168.199.183:5001';
var baseUrl = 'http://localhost:3000'
ide.controller('IDECtrl', function ($scope,$timeout,$http,$interval,
                                    ProjectService,
                                    GlobalService,
                                    Preference,
                                    TemplateProvider,ResourceService) {

    $scope.ide={
        loaded:false    //页面是否渲染完成
    };

    var loadStep=0;     //加载到了第几步,共8步



    //receiveGlobalProject();
    readProjectData()

    listenChange();

    loadPreference();


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
        window.localStorage.setItem('projectId',id);
        //$http({
        //    method:'GET',
        //    url:baseUrl+'/project/'+id+'/content'
        //}).success(function (data) {
        //    console.log(data)
        //    data = GlobalService.getBlankProject()
        //    console.log(data)
        //    //if (data){
        //    //    var globalProject=data;
        //    //    TemplateProvider.saveProjectFromGlobal(globalProject);
        //    //    ProjectService.saveProjectFromGlobal(globalProject, function () {
        //    //        $scope.$broadcast('GlobalProjectReceived');
        //    //
        //    //    });
        //    //}else{
        //    //
        //    //    console.log('获取信息失败');
        //    //
        //    //    readCache();
        //    //}
        //    //readCache()
        //}).error(function (err) {
        //    console.log(err)
        //    readCache()
        //})

        $http({
            method:'GET',
            url:baseUrl+'/project/'+id+'/content'
        }).success(function (data) {

            if (data){

                //var globalProject = GlobalService.getBlankProject()
                //console.log(globalProject)
                //
                //TemplateProvider.saveProjectFromGlobal(globalProject);
                //ProjectService.saveProjectFromGlobal(globalProject, function () {
                //    $scope.$broadcast('GlobalProjectReceived');
                //
                //});

                readCache();
            }else{
                console.log('获取信息失败');

                readCache();
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

    function reLogin(_callback,_errCallback) {
        $http({
                method:'POST',
                url:baseUrl+'/login',
                data:{
                    user: {
                        username:'sa1',
                        password:'123456'
                    }
                }
            }
        ).success(function (result) {

            if (result.status!='success'){
                return;
            }
            var token=result.token;
            window.localStorage.setItem('token',token);
            var pid=result.user.projects[0].pid;
            window.localStorage.setItem('editPid',pid);

            _callback&&_callback(result);
        }).error(function (err) {
            _errCallback&&_errCallback(err);
        });
    }
    /**
     * 接收打开的项目并且通知其他controller获取
     */
    function receiveGlobalProject(){
        reLogin(function (result) {
            $http({
                method:'GET',
                url:+'/projectData',
                params:{
                    token:window.localStorage.getItem('token'),
                    pid:window.localStorage.getItem('editPid')
                }
            }).success(function (r) {
                var data=r.data;

                if (data){
                    var globalProject=JSON.parse(data);
                    globalProject = GlobalService.getBlankProject()
                    console.log(globalProject)

                    TemplateProvider.saveProjectFromGlobal(globalProject);
                    ProjectService.saveProjectFromGlobal(globalProject, function () {
                        $scope.$broadcast('GlobalProjectReceived');

                    });
                }else{
                    console.log('获取信息失败');

                    readCache();
                }
            }).error(function (msg) {
                console.log(msg);
                readCache();

            })
        },function (err) {
            console.log(err);
            readCache();

        })

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
        //$scope.$on('LoadUp', function () {
        //
        //    loadStep++;
        //    if (loadStep==8){
        //        //到达第8步,加载完成
        //        $timeout(function () {
        //            $scope.ide.loaded=true;
        //
        //            intervalSave();
        //
        //        },2000)
        //    }
        //})

        $timeout(function () {
            $scope.ide.loaded=true;

            //intervalSave();

        },2000)

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

        $scope.$on('SwitchCurrentPage', function (event,callback) {
            $scope.$broadcast('PageChangedSwitched',callback);
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
        })



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
        })

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
            var pid=window.localStorage.getItem('editPid');
            window.localStorage.setItem('projectCache'+pid,JSON.stringify($scope.project));
        },5*60*1000);

        //保持登录
        $interval(function () {

            console.log('重新登录');
            reLogin();
        },20*60*1000)
    }

    function readCache() {
        try{
            console.log('读取缓存');
            var pid=window.localStorage.getItem('editPid');
            var project=JSON.parse(window.localStorage.getItem('projectCache'+pid));
            console.log(project)
            var globalProject=project;
            //console.log(globalProject);
            globalProject = GlobalService.getBlankProject()
            TemplateProvider.saveProjectFromGlobal(globalProject);
            ProjectService.saveProjectFromGlobal(globalProject, function () {
                ResourceService.syncFiles()
                $scope.$broadcast('GlobalProjectReceived');

            });
        }catch (e){
            console.log(e)
            toastr.info('获取项目失败')
        }

    }


});