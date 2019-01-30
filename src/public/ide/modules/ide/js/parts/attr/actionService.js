/**
 *Created by Zzen1sS on 23/3/16
 */

ideServices.service('ActionService',['ProjectService','Type',function (ProjectService,Type) {
    var actions = [];

    function Trigger(name,value) {
        this.name = name||'';
        this.value = value||'';
    }

    var tBlank = new Trigger();
    var tPress = new Trigger('按下','Press');
    var tRelease = new Trigger('释放','Release');
    var tLoad = new Trigger('加载','Load');
    var tUnload = new Trigger('离开','UnLoad');
    var tEnterLowAlarm = new Trigger('进入低警报','EnterLowAlarm');
    var tLeaveLowAlarm = new Trigger('离开低警报','LeaveLowAlarm');
    var tEnterHighAlarm = new Trigger('进入高警报','EnterHighAlarm');
    var tLeaveHighAlarm = new Trigger('离开高警报','LeaveHighAlarm');
    var tEnter = new Trigger('进入','Enter');
    var tLeave = new Trigger('离开','Leave');
    var tTagChange = new Trigger('Tag改变','TagChange');



    var defaultActions = [{
        title:'action0',
        trigger:'',
        commands:[

        ]
    }];

    var triggers = [tPress,tRelease];

    /**
     * 返回所有的actions
     * @returns {Array}
     */
    this.getAllActions = function () {
        return actions;
    };
    this.getTriggers = function (type) {
        switch (type){
            case Type.MyPage:
                triggers = [tLoad,tUnload];
                break;
            case Type.MyLayer:
                // triggers = [tLoad,tUnload];
                break;
            case Type.MySubLayer:
                triggers = [tLoad,tUnload];
                break;
            case Type.MyButton:
                triggers = [tRelease];
                break;
            case Type.MyButtonSwitch:
                triggers = [tRelease];
                break;
            case Type.MyButtonGroup:
                triggers = [tRelease];
                break;
            case Type.MySlideBlock:
                triggers = [tRelease,tEnterLowAlarm,tLeaveLowAlarm,tEnterHighAlarm,tLeaveHighAlarm,tTagChange];
                break;
            case Type.MyScriptTrigger:
            case Type.MyProgress:
            case Type.MyDashboard:
            case Type.MyNum:
            case Type.MyTexNum:
                triggers = [tEnterLowAlarm,tLeaveLowAlarm,tEnterHighAlarm,tLeaveHighAlarm,tTagChange];
                break;
            case Type.MyTouchTrack:
                triggers = [tTagChange];
                break;
            default:
                triggers = [tEnter,tLeave];
        }
        return triggers;
    };
    this.setActions = function (newActions) {
        if (newActions){
            actions = newActions;
        }else{
            actions = _.cloneDeep(defaultActions);
        }

    };
    this.setTriggers = function (newTriggers) {
        if (newTriggers){
            triggers = newTriggers;
        }

    };
    this.deleteActionByIndex = function (index, sCB, fCB) {
        if (index <0 || index>actions.length-1 ){
            fCB && fCB();
            return false;
        }else {
            actions.splice(index,1);
            ProjectService.ChangeAttributeAction(_.cloneDeep(actions));
            sCB && sCB();
            return true;
        }
    };
    this.appendAction = function (action,CB) {
        actions.push(action);
        ProjectService.ChangeAttributeAction(_.cloneDeep(actions));
        CB && CB();
    };
    this.updateActionByIndex = function (action, index, sCB,fCB) {
        if (index>=0&&index<actions.length ){
            actions[index] = action;
            ProjectService.ChangeAttributeAction(_.cloneDeep(actions));
            sCB && sCB();
        }else{
            fCB&&fCB();
        }
    };

    /**
     * 返回一个新的空Action
     * @returns {{title: string, trigger: string, commands: Array}}
     */
    this.getNewAction = function () {
        return {
            title:'default',
            trigger:'',
            commands :[]
        }
    }
}])