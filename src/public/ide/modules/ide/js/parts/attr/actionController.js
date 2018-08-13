/**
 * Created by Zzen1ss on 23/3/2016
 */

ide.controller('ActionCtl',['$scope', 'ActionService','TagService','$uibModal','ProjectService', 'Type','OperationService',function ($scope, ActionService,TagService,$uibModal,ProjectService,Type,OperationService) {

    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
        $scope.$emit('LoadUp');

    });


    $scope.$on("MaskView",function(event,data){
        $scope.myMask=data;
    });

    function initUserInterface(){
        $scope.status={
            collapsed : false
        };
        readActionInfo();
        $scope.tags = TagService.getAllCustomTags();
        $scope.timerTags = TagService.getAllTimerTags();

        $scope.collapse = function ($event) {

            $scope.status.collapsed=!$scope.status.collapsed;

        };
        $scope.animationsEnabled = true;
    }


    /**
     * 初始化$scope.actions和$scope.triggers
     */
    function readActionInfo(){
        if (!ProjectService.getCurrentSelectObject()){
            console.warn('空!');
            return;
        }
        // console.log(ProjectService.getCurrentSelectObject())
        var curLevel = ProjectService.getCurrentSelectObject().level;
        var _actions = _.cloneDeep(curLevel.actions);
        ActionService.setActions(_actions);
        $scope.actions = ActionService.getAllActions();
        $scope.triggers = ActionService.getTriggers(ProjectService.getCurrentSelectObject().level.type);
        $scope.tags = TagService.getAllCustomTags();
        $scope.timerTags = TagService.getAllTimerTags();


        var currentSelectedObject = _.cloneDeep(ProjectService.getCurrentSelectObject().level);
        if (!currentSelectedObject) {
            console.warn('空!');
            return;
        }
        ////console.log(currentSelectedObject);
        switch (currentSelectedObject.type) {
            case Type.MyButton:
            case Type.MyNumber:
            case Type.MyProgress:
            case Type.MyDashboard:
            case Type.MyButtonGroup:
            // case Type.MyLayer:
            case Type.MySubLayer:
            case Type.MyPage:
            case Type.MyNum:
            case Type.MyImage:
            case Type.MyScriptTrigger:
            case Type.MySlideBlock:
            case Type.MyTexNum:
            case Type.MyAlphaImg:
                $scope.showActionPanel = true;
                break;
            case Type.MySlide:
            case Type.MySwitch:
            default:
                $scope.showActionPanel = false;

        }

        switch (currentSelectedObject.type){
            case Type.MyPage:
                $scope.showAddActionPanel = true;
                break;
            default :
                $scope.showAddActionPanel = false;
        }


    }


    function initProject(){
        /**
         * 监听属性Attribute的改变
         */
        $scope.$on('AttributeChanged', function () {
            //console.log('action changed')
            readActionInfo();
        });

        /**
         * 删除Action
         * @param index
         */
        $scope.deleteAction = function (index) {
            ActionService.deleteActionByIndex(index,function(){
                $scope.actions = ActionService.getAllActions();
            }.bind(this))
        };

        /**
         * 打开指定Action面板，
         * @param index
         */
        $scope.openPanel = function (index) {
            $scope.selectedIdx = index;
            // console.log($scope.tags);
            var targetAction ;
            if (index == -1){
                //newAction
                targetAction = ActionService.getNewAction();
                targetAction.newAction=true;
            }else if (index>=0&&index<$scope.actions.length){
                targetAction = _.cloneDeep($scope.actions[index]);
                targetAction.newAction=false;
            }
            //console.log('targetAction',targetAction);
            var actionNames=[];
            for(var i=0;i<$scope.actions.length;i++){
                actionNames.push($scope.actions[i].title);
            }
            /**
             * 利用$uiModal服务，制作模态窗口
             */
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'actionPanelModal.html',
                controller: 'ActionInstanceCtrl',
                size: 'lg',
                resolve: {
                    action: function () {
                        return targetAction;
                    },
                    triggers: function () {
                        return $scope.triggers;
                    },
                    tags: function () {
                        return $scope.tags;
                    },
                    timerTags: function(){
                        return $scope.timerTags;
                    },
                    actionNames: function(){
                        return actionNames;
                    }
                }
            });

            /**
             * result.then接收两个匿名函数参数
             * calling $uibModalInstance.close will trigger the former function
             * when clicking at the background, pressing the esc button on keyboard, or calling $modalInstance.dismiss will trigger the latter one
             */
            modalInstance.result.then(function (newAction) {
                //process save
                if ($scope.selectedIdx == -1){
                    //new action
                    ActionService.appendAction(newAction, function () {
                        $scope.actions = ActionService.getAllActions();
                    }.bind(this))
                }else if ($scope.selectedIdx>=0 && $scope.selectedIdx<$scope.actions.length){
                    //update
                    ActionService.updateActionByIndex(newAction,$scope.selectedIdx, function () {
                        $scope.actions = ActionService.getAllActions();
                    }.bind(this))
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }

}])

/**
 * action 模态窗口控制器
 */
    .controller('ActionInstanceCtrl',['$scope', '$uibModalInstance','ProjectService', 'action','triggers','tags','timerTags','actionNames','OperationService', function ($scope, $uibModalInstance,ProjectService, action,triggers,tags,timerTags,actionNames,OperationService) {

        var blankCmd = [{name:'',symbol:''}, {tag:'', value:''}, {tag:'', value:''}];

        $scope.ops = OperationService.getOperations();

        $scope.tags=_.map(tags.filter(function(item){
            return item.bindMod=='default';

        }),'name');

        $scope.timerTags = _.map(timerTags,function(timerTags){
            return timerTags.name;
        });

        $scope.action = action;

        $scope.triggers = triggers;

        $scope.actionNames = actionNames;

        $scope.currentChosenIdx = $scope.action.commands.length-1;
        if ($scope.currentChosenIdx>0){
            $scope.chosenCmd = $scope.action.commands[$scope.currentChosenIdx];
        }else{
            $scope.chosenCmd = _.cloneDeep(blankCmd);
        }

        $scope.showCustomTags = true;

        $scope.validateArr = $scope.action.commands.map(function(cmd){
            return {
                pass:true,
                tooltip:''
            }
        });


        $scope.changeTagShowState = function(){
            var operation = $scope.chosenCmd[0].symbol;
            if(operation.indexOf('setTimer')!==-1){
                $scope.showCustomTags = false;
            }else{
                $scope.showCustomTags = true;
            }
        };

        //检查输入值是否为整数
        $scope.checkValueIsInt = function () {
            var value = $scope.chosenCmd[2].value;
            if(!!value&&!_.isInteger(value)){
                toastr.warning('值只能为整数');
                $scope.chosenCmd[2].value = parseInt(value);
            }
        };

        //选择指令
        $scope.chooseCmd = function (index) {
            var operation = $scope.action.commands[index][0].symbol||'';
            if(operation.indexOf('setTimer')!==-1){
                $scope.showCustomTags = false;
            }else{
                $scope.showCustomTags = true;
            }
            $scope.currentChosenIdx = index;
            $scope.chosenCmd = $scope.action.commands[index];

            $scope.$broadcast('ResetTagChoose');
            //console.log('chosenCmd',$scope.chosenCmd);
        };

        //增加新指令
        $scope.addNewCmd = function () {
            if($scope.action.trigger==''){
                toastr.error('未选择触发方式！');
                return;
            }

            $scope.action.commands.splice($scope.currentChosenIdx + 1, 0, _.cloneDeep(blankCmd));
            $scope.currentChosenIdx += 1;
            $scope.chosenCmd = $scope.action.commands[$scope.currentChosenIdx];

            $scope.validateArr.push({
                pass:true,
                tooltip:''
            });

            $scope.$broadcast('ResetTagChoose');
        };

        //删除指令
        $scope.deleteCmd = function (index) {
            $scope.action.commands.splice(index,1);
            $scope.currentChosenIdx -= 1;
        };

        //快捷添加定时器
        $scope.shortcutTimer = $scope.timerTags==''?'':$scope.timerTags[0];
          $scope.shortcutAddTimer = function (){
            if($scope.action.trigger==''){
                toastr.error('未选择触发方式！');
                return;
            }
            if($scope.shortcutTimer==''){
                toastr.error('未添加定时器！');
                return;
            }
            var defaultTimers=[
                {name: "SET_TIMER_START", symbol: "setTimerStart", value:"0"},
                {name: "SET_TIMER_STOP", symbol: "setTimerStop", value:""},
                {name: "SET_TIMER_STEP", symbol: "setTimerStep", value:"1"},
                {name: "SET_TIMER_INTERVAL", symbol: "setTimerInterval", value:""},
                {name: "SET_TIMER_CURVAL", symbol: "setTimerCurVal", value:"0"},
                {name: "SET_TIMER_MODE", symbol: "setTimerMode", value:""}
            ];
            _.forEach(defaultTimers,function(timer){
                var customTimer = [{name:timer.name,symbol:timer.symbol}, {tag:$scope.shortcutTimer, value:''}, {tag:'', value:timer.value}];
                $scope.action.commands.push(customTimer);
                $scope.validateArr.push({
                    pass:true,
                    tooltip:''
                });
            });
            $scope.currentChosenIdx += 6;
            $scope.chosenCmd = $scope.action.commands[$scope.currentChosenIdx];
        }
        ;

        //保存
        $scope.save = function (th) {

            if(!validateCmds($scope.action.commands,tags)){
                toastr.error('指令有误，请根据提示检查');
                return;
            }

            //判断是否和初始一样
            if(th.action.newAction===false){
                if (th.action.title===restoreValue){
                    $uibModalInstance.close($scope.action);
                    return;
                }
            }
            if(validation&&duplicate(th)){
                $uibModalInstance.close($scope.action);
            }
        };

        //取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var restoreValue=$scope.action.title;

        var validation=true;

        //保存旧值
        $scope.store=function(th){
            restoreValue=th.action.title;
        };

        //恢复旧值
        $scope.restore = function (th) {
            th.action.title=restoreValue;
        };

        //验证新值
        $scope.enterName=function(th){
            //判断是否和初始一样
            if (th.action.title===restoreValue){
                return;
            }
            //输入有效性检测
            validation=ProjectService.inputValidate(th.action.title,true);
            if(!validation||!duplicate(th)){
                $scope.restore(th);
                return;
            }
            toastr.info('修改成功');
            restoreValue=th.action.title;
        };

        //验证重名
        function duplicate(th){
            var tempArray=$scope.actionNames;
            for(var i=0;i<tempArray.length;i++){
                if(th.action.title===tempArray[i]){
                    toastr.info('重复的动作名');
                    return false;
                }
            }
            return true;
        }

        //验证enter键
        $scope.enterPress=function(e,th){
            if (e.keyCode==13){
                $scope.enterName(th);
            }
        };

        //tagSelect Obj
        $scope.selectedTagObjArray=[
            {
                tagName:null,
                useTag:true
            },
            {
                tagName:null,
                useTag:true
            }
        ];

        //tagSelect 回调
        $scope.actionFunction=function(index){
            $scope.chosenCmd[index+1].tag=$scope.selectedTagObjArray[index].tagName;
        };

        //启用变量
        $scope.usetagSwitch=function(index){
            $scope.selectedTagObjArray[index].tagName='';
            $scope.actionFunction(index);
        };


        /**
         * 对所有的指令在保存前进行一次校验
         * @param cmds 所有指令
         * @param tags  所有tag
         * @returns {boolean} 是否通过检查
         */
        function validateCmds(cmds,tags){
            var errTooltip = {
                SET_STR:"操作数1必须是变量，且类型为'字符串'型",
                CONCAT_STR:"操作数1必须是变量，且类型为'字符串'型",
                DEL_STR_FROM_TAIL:"操作是1必须是变量，且类型为'字符串'型，操作数2必须为'数字'类型的变量或数字值",
                DEL_STR_FROM_HEAD:"操作是1必须是变量，且类型为'字符串'型，操作数2必须为'数字'类型的变量或数字值",
                GET_STR_LEN:"操作数1必须是变量，且类型为'数字'型,操作数2必须是变量，且类型为'字符串'型",
                EMPTY:"操作符不能为空",
                NOT_NUMBER:"操作数2的值必须为数字类型"
            };
            var getTagValueType = function(tagName){
                for(var i=0,il=tags.length;i<il;i++){
                    if(tags[i].name===tagName){
                        return tags[i].valueType;
                    }
                }
                return -1;
            };
            var validateArr = $scope.validateArr;
            var pass = true;
            cmds.forEach(function(cmd,index){
                if(cmd[0].name===""){
                    validateArr[index].pass = false;
                    validateArr[index].tooltip = errTooltip['EMPTY'];
                    pass = false;
                    return;
                }
                var value = Number(cmd[2].value);
                var reg =/^(\-|\+)?\d+(\.\d+)?$/;
                if(value!=''&&!reg.test(value)){
                    validateArr[index].pass = false;
                    validateArr[index].tooltip = errTooltip['NOT_NUMBER'];
                    pass = false;
                    return;
                }
                switch(cmd[0].name){
                    case 'SET_STR':
                        if(!cmd[1].tag||getTagValueType(cmd[1].tag)!==1){
                            validateArr[index].pass = false;
                            validateArr[index].tooltip = errTooltip['SET_STR'];
                            pass = false;
                        }
                        break;
                    case 'CONCAT_STR':
                        if(!cmd[1].tag||getTagValueType(cmd[1].tag)!==1){
                            validateArr[index].pass = false;
                            validateArr[index].tooltip = errTooltip['SET_STR'];
                            pass = false;
                        }
                        break;
                    case 'DEL_STR_FROM_TAIL':
                        if(!cmd[1].tag||getTagValueType(cmd[1].tag)!==1||(cmd[2].tag&&getTagValueType(cmd[2].tag)!==0)){
                            validateArr[index].pass = false;
                            validateArr[index].tooltip = errTooltip['DEL_STR_FROM_TAIL'];
                            pass = false;
                        }
                        break;
                    case 'DEL_STR_FROM_HEAD':
                        if(!cmd[1].tag||getTagValueType(cmd[1].tag)!==1||(cmd[2].tag&&getTagValueType(cmd[2].tag)!==0)){
                            validateArr[index].pass = false;
                            validateArr[index].tooltip = errTooltip['DEL_STR_FROM_TAIL'];
                            pass = false;
                        }
                        break;
                    case 'GET_STR_LEN':
                        if(!cmd[1].tag||getTagValueType(cmd[1].tag)!==0||(cmd[2].tag&&getTagValueType(cmd[2].tag)!==1)){
                            validateArr[index].pass = false;
                            validateArr[index].tooltip = errTooltip['DEL_STR_FROM_TAIL'];
                            pass = false;
                        }
                        break;
                    default:
                        break;
                }
            });
            return pass;
        }
    }]);