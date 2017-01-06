//init a new CAN application
var CAN = angular.module('CANApp',['ngAnimate']);


//CAN controller
CAN.controller('CANController', ['$scope','$http','CANService','$timeout',function($scope,$http,CANService,$timeout){

    //init project
    initLocal();
    loadProject();

    /**
     * 初始化本地版软件
     */
    function initLocal(){
        try{
            var os = require('os');
            if(os){
                fs = require('fs');
                path = require('path');
                window.local = true;
                
                var platform = os.platform();
                if(platform=='darwin'){
                    pathUrl = '/Users/lixiang/Desktop/CAN.json';
                }else if(platform=='win32'){
                    pathUrl = path.join(global.__dirname,'/localproject','CAN.json');
                }
            }
        }
        catch(e){
            console.log(e);
        }
    }

    /**
     * 载入工程
     */
    function loadProject(){
        //localStorage.clear();
        if(window.local){

        }else{
            var url = window.location.href;
            var url_splices = url.split('/');
            for(var i=0;i<url_splices.length;i++){
                if(url_splices[i]=='CANProject'){
                    $scope.projectId = url_splices[i+1];
                    break;
                }
            }
            $http({
                method:'GET',
                url:'/CANProject/'+$scope.projectId+'/content'
            }).success(function(project){
                //console.log('keke content',project);
                if(project.content){
                    var pro = JSON.parse(project.content);
                    loadFromContent(pro);
                }else{
                    loadFromBlank();
                }
                initUI();
                showCANIDE();

            }).error(function(err){
                console.log('err',err);
                loadFromBlank();
                initUI();
                showCANIDE();
            })
        }
    };

    /**
     * 获取空白工程
     */
    function loadFromBlank(){
        $scope.globalProject = _.cloneDeep(CANService.getBlankProject()); 
    }

    /**
     * 根据内容获取工程
     * @param data
     */
    function loadFromContent(data){
        if(!data.CANPort.timer){
            data.timer=CANService.getNewTimer();
        }
        if(!data.IOConfig){
            data.IOConfig=CANService.getNewIOConfig();
        }
        $scope.globalProject = data;
    }


    /**
     * 初始化界面
     */
    function initUI(){
        $scope.haveSvaed = false;
        $scope.component={
            showDataFrameConfig:showDataFrameConfig,
            showDataFrameInfo:showDataFrameInfo,
            addDataFrame:addDataFrame,
            deleteDataFrame:deleteDataFrame,
            addDataFrameInfo:addDataFrameInfo,
            deleteDataFrameInfo:deleteDataFrameInfo,
            addIOConfig:addIOConfig,
            deleteIOConfig:deleteIOConfig,
            saveProject:saveProject,
            setBaudRate:setBaudRate,
            downloadProject:downloadProject,
            checkCANId:checkCANId,
            checkSendData:checkSendData,
            switchData:switchData,

            CANPortId:['CAN1','CAN2'],
            portMap:['normal','remap1','remap2'],
            normalOrExpand:['normal','expand'],
            tsjw:[{name:'1tq',value:0},{name:'2tq',value:1},{name:'3tq',value:2},{name:'4tq',value:3}],
            tbs2:[{name:'1tq',value:0},{name:'2tq',value:1},{name:'3tq',value:2},{name:'4tq',value:3},
                  {name:'5tq',value:4},{name:'6tq',value:5},{name:'7tq',value:6},{name:'8tq',value:7}],
            tbs1:[{name:'1tq',value:0},{name:'2tq',value:1},{name:'3tq',value:2},{name:'4tq',value:3},
                  {name:'5tq',value:4},{name:'6tq',value:5},{name:'7tq',value:6},{name:'8tq',value:7},
                  {name:'9tq',value:8},{name:'10tq',value:9},{name:'11tq',value:10},{name:'12tq',value:11},
                  {name:'13tq',value:12},{name:'14tq',value:13},{name:'15tq',value:14},{name:'16tq',value:15}],
            GPIO:['GPIO A','GPIO B','GPIO C','GPIO D','GPIO E'],
            IOMode:['up','down']
        };

        //jQuery 开启IO配置按钮
        var enableIO = $scope.globalProject.IOConfig.enableConfig;
        var IOConfigEle = $('#IOConfig');
        console.log('enableIO',enableIO);
        $('input[name="my-checkbox"]').bootstrapSwitch('state',enableIO,true);
        if(enableIO){
            IOConfigEle.css('display','block');
        }else{
            IOConfigEle.css('display','none');
        }

    }

    /**
     * 显示或隐藏数据帧配置
     * @param index
     */
    function showDataFrameConfig(index){
        $scope.globalProject.dataFrameArr[index].showDataFrame=!$scope.globalProject.dataFrameArr[index].showDataFrame
    }

    /**
     * 显示或隐藏数据帧具体信息
     * @param index
     * @param dataFrameId
     */
    function showDataFrameInfo(index,dataFrameId){
        console.log('dataFrameId',dataFrameId,index);
        console.log('$scope.globalProject',$scope.globalProject);
        $scope.globalProject.dataFrameArr[dataFrameId].frameInfoArr[index].showDataFrameInfo=!$scope.globalProject.dataFrameArr[dataFrameId].frameInfoArr[index].showDataFrameInfo;
    }

    /**
     * 添加数据帧
     */
    function addDataFrame(){
        var index = $scope.globalProject.dataFrameArr.length;
        var newDataFrame = CANService.getNewDataFrame(index);
        $scope.globalProject.dataFrameArr.push(newDataFrame);
    }

    /**
     * 删除数据帧
     * @param index
     */
    function deleteDataFrame(index){
        if($scope.globalProject.dataFrameArr.length==1){
            toastr.warning('至少有一帧数据');
            return;
        }
        $scope.globalProject.dataFrameArr.splice(index,1);
    }

    /**
     * 添加数据帧具体信息
     * @param index
     */
    function addDataFrameInfo(index){
        var indexOfFrameInfo = $scope.globalProject.dataFrameArr[index].frameInfoArr.length;
        var newDataFrameInfo = CANService.getNewDataFrameInfo(indexOfFrameInfo);
        $scope.globalProject.dataFrameArr[index].frameInfoArr.push(newDataFrameInfo);
    }

    /**
     * 删除数据帧具体信息
     * @param index
     * @param dataFrameId
     */
    function deleteDataFrameInfo(index,dataFrameId){
        if($scope.globalProject.dataFrameArr[dataFrameId].frameInfoArr.length==1){
            toastr.warning('至少有一条信息');
            return;
        }
        $scope.globalProject.dataFrameArr[dataFrameId].frameInfoArr.splice(index,1);
    }

    /**
     * 添加一个新的IO配置
     */
    function addIOConfig(){
        var newIOConfig = CANService.getNewIOConfigInfo();
        $scope.globalProject.IOConfig.configArr.push(newIOConfig);
    }

    /**
     * 删除一个IO配置
     * @param index
     */
    function deleteIOConfig(index){
        //console.log('index',index);
        $scope.globalProject.IOConfig.configArr.splice(index,1);
    }

    /**
     * 保存工程
     */
    function saveProject(){
        //配置波特率
        setBaudRate();
        //localStorage.CANProject = JSON.stringify(_.cloneDeep($scope.globalProject));
        if(window.local){

        }else{
            if(!$scope.haveSvaed){
                $scope.haveSvaed = true;
                $http({
                    method:'POST',
                    url:'/CANProject/'+$scope.projectId+'/save',
                    data:{data:$scope.globalProject}
                }).success(function(data){
                    if(data=='ok'){
                        toastr.info('保存成功');
                    }else{
                        toastr.warning('保存失败');
                    }
                }).error(function(err){
                    console.log('err',err);
                    toastr.warning('保存失败');
                });

                var watch = $scope.$watch('globalProject',function(newValue,oldValue,scope){
                    if(newValue!=oldValue)
                        $scope.haveSvaed=false;
                },true)
            }
        }
    }

    /**
     * 下载工程
     */
    function downloadProject(){
        setBaudRate();
        localStorage.CANProject = JSON.stringify(_.cloneDeep($scope.globalProject));
        var project = _.cloneDeep($scope.globalProject);
        project.dataFrameArr.forEach(function(item){
            if(item.CANId){
                item.CANId = "0x"+item.CANId.toUpperCase();
            }
        });
        var projectJSON = JSON.stringify(project,null,4);
        if(window.local){
            console.log('path',global.__dirname);
            fs.writeFile(pathUrl,projectJSON,function(err){
                if(err){
                    console.log('write file error!',err);
                }else{
                    console.log('write file success!');
                    toastr.info('生成下载成功！');
                }
            })
        }
    }

    /**
     * 配置波特率
     */
    function setBaudRate(){
        var tsjw = ($scope.globalProject.CANPort.tsjw==null)?null:($scope.globalProject.CANPort.tsjw+1);
        var tbs1 = ($scope.globalProject.CANPort.tbs1==null)?null:($scope.globalProject.CANPort.tbs1+1);
        var tbs2 = ($scope.globalProject.CANPort.tbs2==null)?null:($scope.globalProject.CANPort.tbs2+1);
        var brp = $scope.globalProject.CANPort.brp;
        var fpClk1 = 36000;
        if(!(tsjw&&tbs1&&tbs2&&brp)){
            $scope.globalProject.CANPort.baudRate=null;
            toastr.warning('配置数据不完整！');
            return;
        }
        if(brp<0||brp>1024){
            $scope.globalProject.CANPort.baudRate=null;
            toastr.warning('波特率分频器超出范围！');
            return;
        }
        $scope.globalProject.CANPort.baudRate = fpClk1/((tsjw+tbs2+tbs1)*brp);
    }

    /**
     *检查CANId是否为16进制
     * @param index
     */
    function checkCANId(index){
        //console.log('index',index);
        var CANIdStr,
            pattern,
            result;
        if(index==undefined){
            CANIdStr = $scope.globalProject.CANPort.timer.CANId;
            pattern =/^[0-9a-fA-F]{0,8}$/;
            result = pattern.test(CANIdStr);
        }else{
            CANIdStr = $scope.globalProject.dataFrameArr[index].CANId;
            pattern =/^[0-9a-fA-F]{0,8}$/;
            result = pattern.test(CANIdStr);
        }
        // console.log('result',result);
        if(!result){
            toastr.error('ID格式有误');
        }
    }

    /**
     * 将定时器发送的数据，按字节形式存入数组
     */
    function switchData(){
        if(checkSendData()){
            dataStr = $scope.globalProject.CANPort.timer.data;
            if(dataStr.length%2!=0){
                dataStr='0'+dataStr;
            }
            var arr = [];
            for(var i=0;i<dataStr.length;i+=2){
                arr.push(dataStr.slice(i,i+2));
            }
            $scope.globalProject.CANPort.timer.dataArr=arr;
        }
    }

    /**
     * 检查定时器所发数据是否为16进制
     * @returns {boolean}
     */
    function checkSendData(){
        dataStr = $scope.globalProject.CANPort.timer.data;
        pattern = /^[0-9a-fA-F]{0,16}$/;
        result = pattern.test(dataStr);
        if(!result){
            toastr.error('数据格式有误!');
            return false;
        }
        return true;
    }


    /**
     * 根据状态更新是否显示IO配置选项
     * @param state
     */
    function updateIOState(state){
        $scope.globalProject.IOConfig.enableConfig=state;
        if(state){
            $('#IOConfig').show("normal");
            $('#addIOConfig').attr('disabled',false);
        }else{
            $('#IOConfig').hide('normal');
            $('#addIOConfig').attr('disabled',true);
        }
    }

    /**
     * 使用jquery监听IO开关事件(bootstrap-switch仅支持此事件)
     */
    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        updateIOState(state);
    });

    /**
     * 加载完成，显示CAN配置页面
     */
    function showCANIDE(){
        $timeout(function () {
            window.spinner && window.spinner.hide();
        },200)
    }

}]);


