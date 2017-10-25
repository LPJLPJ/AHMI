/**
 * Created by Zzen1ss on 23/3/2016
 */

ide.controller('ActionCtl',['$scope','ActionService','TagService','$uibModal','ProjectService', 'Type','OperationService',function ($scope, ActionService,TagService,$uibModal,ProjectService,Type,OperationService) {

    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
        $scope.$emit('LoadUp');

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
            readActionInfo();
        });

        /**
         * 删除Action
         * @param index
         */
        $scope.deleteAction = function (index) {
            ProjectService.deleteActionName(ActionService.getAllActions()[index].title);
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
            }else if (index>=0&&index<$scope.actions.length){
                targetAction = _.cloneDeep($scope.actions[index]);
            }
            //console.log('targetAction',targetAction);
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
    .controller('ActionInstanceCtrl',['$scope', '$uibModalInstance','ProjectService', 'action','triggers','tags','timerTags','OperationService', function ($scope, $uibModalInstance,ProjectService, action,triggers,tags,timerTags,OperationService) {
        //$scope.ops = ['GOTO','SET','INC','DEC'];

        var blankCmd = [{name:'',symbol:''}, {tag: '', value: ''}, {tag: '', value: ''}];
        $scope.ops = OperationService.getOperations();

        $scope.tags=_.map(tags.filter(function(item){
            return item.bindMod=='default';

        }),'name');
        $scope.timerTags = _.map(timerTags,function(timerTags){
          return timerTags.name;
        });
        $scope.action = action;
        $scope.triggers = triggers;

        $scope.currentChosenIdx = $scope.action.commands.length-1;
        if ($scope.currentChosenIdx>0){
            $scope.chosenCmd = $scope.action.commands[$scope.currentChosenIdx];
        }else{
            $scope.chosenCmd = _.cloneDeep(blankCmd);
        }

        $scope.showCustomTags = true;
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

            //console.log('chosenCmd',$scope.chosenCmd);
        };

        //增加新指令
        $scope.addNewCmd = function () {
            $scope.action.commands.splice($scope.currentChosenIdx + 1, 0, _.cloneDeep(blankCmd));
            $scope.currentChosenIdx += 1;
            $scope.chosenCmd = $scope.action.commands[$scope.currentChosenIdx];
            if($scope.action.trigger==''){
                toastr.error('未选择触发方式！');
            }
        };

        //删除指令
        $scope.deleteCmd = function (index) {
            $scope.action.commands.splice(index,1);
            $scope.currentChosenIdx -= 1;
        };

        //保存
        $scope.save = function (th) {
            if(validation&&duplicate(th)){
                titleArray.push(th.action.title);
                ProjectService.setActionArray(titleArray);
                $uibModalInstance.close($scope.action);
            }
        };

        //取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var restoreValue;
        var validation=true;
        var titleArray=[];
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
            ProjectService.deleteActionName(restoreValue);
            restoreValue=th.action.title;
        };
        //验证重名
        function duplicate(th){
            titleArray=_.cloneDeep(ProjectService.getActionArray());
            for(var i=0;i<titleArray.length;i++){
                if(th.action.title===titleArray[i]){
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
    }]);