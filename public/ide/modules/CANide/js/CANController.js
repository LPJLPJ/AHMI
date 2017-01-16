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
                __dirname = global.__dirname;
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
            //console.log(e);
        }
    }

    /**
     * 载入工程
     */
    function loadProject(){
        //localStorage.clear();
        if(window.local){
            readLocalCANProjectData();
        }else{
            readServerCANProjectData()
        }
    };

    /**
     * 本地版读取工程数据
     * @return {[type]} [description]
     */
    function readLocalCANProjectData(){
        var url = window.location.href;
        var CANProjectId = url.split('?')[1].split('=')[1]
        if(CANProjectId[CANProjectId.length-1]==="#"){
            CANProjectId = CANProjectId.slice(0,-1);
        }
        $scope.CANProjectBaseUrl = path.join(__dirname,'localproject','localCANProject',CANProjectId);
        var data = readSingleFile(path.join($scope.CANProjectBaseUrl,'CANProject.json'),true);
        data = JSON.parse(data);
        //console.log('keke',data.content);
        if(data.content){
            var pro = JSON.parse(data.content);
            //console.log('pro',pro);
            loadFromContent(pro);
        }else{
            loadFromBlank();
        }
        initUI();
        showCANIDE();

    }

    /**
     * 从本地文件中读取CAN数据信息
     * @param  {string} filePath 文件路径
     * @param  {boolen} check    是否执行检查
     * @return {object}          CAN数据
     */
    function readSingleFile(filePath,check){
        if(check){
            try{
                var stats = fs.statSync(filePath);
                if(stats&&stats.isFile()){
                    return fs.readFileSync(filePath,'utf-8');
                }else
                    return null
            }catch(e){
                return fs.readFileSync(filePath,'utf-8');
            }
        }
    }

    /**
     * web版读取工程
     * @return {null} 
     */
    function readServerCANProjectData(){
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
        if(!data.timerConfig){
            data.timerConfig=CANService.getNewTimerConfig();
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
            addTimerConfig:addTimerConfig,
            deleteTimerConfig:deleteTimerConfig,
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
        var enableTimer = $scope.globalProject.timerConfig.enableConfig;
        // var IOConfigEle = $('#IOConfig');
        //console.log('enableIO',enableIO);
        $('input[name="IO-checkbox"]').bootstrapSwitch('state',enableIO,true);
        // if(enableIO){
        //     IOConfigEle.css('display','block');
        // }else{
        //     IOConfigEle.css('display','none');
        // }
        $('input[name="timer-checkbox"]').bootstrapSwitch('state',enableTimer,true);
        updateIOState(enableIO);
        updateTimerState(enableTimer);

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
     * 添加一个新的Timer配置
     */
    function addTimerConfig(){
        var newTimerConfig = CANService.getNewTimerConfigInfo();
        $scope.globalProject.timerConfig.configArr.push(newTimerConfig);
    }

    /**
     * 删除一个Timer配置
     */
    function deleteTimerConfig(index){
        $scope.globalProject.timerConfig.configArr.splice(index,1);
    }

    /**
     * 保存工程
     */
    function saveProject(){
        //配置波特率
        setBaudRate();
        //localStorage.CANProject = JSON.stringify(_.cloneDeep($scope.globalProject));
        if(window.local){
            var dataUrl = path.join($scope.CANProjectBaseUrl,'CANProject.json');
            try{
                var oldData = JSON.parse(fs.readFileSync(dataUrl));
                oldData.content=JSON.stringify($scope.globalProject);
                console.log('oldData',oldData);
                fs.writeFileSync(dataUrl,JSON.stringify(oldData));
                toastr.info('保存成功');
            }catch(e){
                toastr.warning('保存失败！')
            }
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
        if(window.local){
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
        }else{
            $http({
                    method:'POST',
                    url:'/CANProject/'+$scope.projectId+'/writeCANFile',
                    data:{data:$scope.globalProject}
                }).success(function(data){
                    if(data=='ok'){
                        toastr.info('生成成功');
                        window.location.href = '/CANProject/'+$scope.projectId+'/downloadCANFile'
                    }else{
                        console.log('data',data);
                        toastr.warning('生成失败');
                    }
                }).error(function(err){
                    console.log('err',err);
                    toastr.warning('生成失败');
                });
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
     * 检查CANId是否为16进制
     * @param index
     */
    function checkCANId(index,type){
        //console.log('index',index);
        var CANIdStr,
            pattern,
            result,
            hexSymbol;
        if(type=='timer'){
            hexSymbol = $scope.globalProject.timerConfig.configArr[index].CANId.slice(0,2);
            if(hexSymbol!='0x'){
                CANIdStr = $scope.globalProject.timerConfig.configArr[index].CANId;
                $scope.globalProject.timerConfig.configArr[index].CANId = '0x'+$scope.globalProject.timerConfig.configArr[index].CANId;
            }else{
                CANIdStr = $scope.globalProject.timerConfig.configArr[index].CANId.slice(2);
            }
            pattern =/^[0-9a-fA-F]{0,8}$/;
            result = pattern.test(CANIdStr);
        }else if(type=='dataFrame'){
            hexSymbol = $scope.globalProject.dataFrameArr[index].CANId.slice(0,2);
            if(hexSymbol!='0x'){
                CANIdStr = $scope.globalProject.dataFrameArr[index].CANId
                $scope.globalProject.dataFrameArr[index].CANId = '0x'+$scope.globalProject.dataFrameArr[index].CANId
            }else{
                CANIdStr = $scope.globalProject.dataFrameArr[index].CANId.slice(2);
            }
            pattern =/^[0-9a-fA-F]{0,8}$/;
            result = pattern.test(CANIdStr);
        }
        if(!result){
            toastr.error('ID格式有误');
        }
    }

    /**
     * 将定时器发送的数据，按字节形式存入数组
     */
    function switchData(index){
        if(checkSendData(index)){
            dataStr = $scope.globalProject.timerConfig.configArr[index].data;
            if(dataStr.length%2!=0){
                dataStr='0'+dataStr;
            }
            var arr = [];
            for(var i=0;i<dataStr.length;i+=2){
                arr.push(dataStr.slice(i,i+2));
            }
            $scope.globalProject.timerConfig.configArr[index].dataArr=arr;
        }
    }

    /**
     * 检查定时器所发数据是否为16进制
     * @returns {boolean}
     */
    function checkSendData(index){
        var hexSymbol = $scope.globalProject.timerConfig.configArr[index].data.slice(0,2);
        if(hexSymbol!='0x'){
            dataStr = $scope.globalProject.timerConfig.configArr[index].data
            $scope.globalProject.timerConfig.configArr[index].data = '0x'+ $scope.globalProject.timerConfig.configArr[index].data;
        }else{
            dataStr = $scope.globalProject.timerConfig.configArr[index].data.slice(2);
        }
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
     * 根据状态更新是否显示Timer配置选项
     * @param state
     */
    function updateTimerState(state){
        $scope.globalProject.timerConfig.enableConfig=state;
        if(state){
            $('#timerConfig').show("normal");
            $('#addTimerConfig').attr('disabled',false);
        }else{
            $('#timerConfig').hide('normal');
            $('#addTimerConfig').attr('disabled',true);
        }
    }

    /**
     * 使用jquery监听IO开关事件(bootstrap-switch仅支持此事件)
     */
    $('input[name="IO-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        updateIOState(state);
    });
    $('input[name="timer-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        updateTimerState(state);
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


