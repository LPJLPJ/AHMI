/**
 *Created by Zzen1sS on 23/3/16
 */

ideServices.service('ActionService',['ProjectService','Type',function (ProjectService,Type) {
    var actions = [];

    var defaultActions = [{
        title:'action0',
        trigger:'Press',
        commands:[

        ]
    }];

    var triggers = ['Press','Release'];

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
                triggers = ['Load','UnLoad'];
                break;
            case Type.MyLayer:
                triggers = ['Load','UnLoad'];
                break;
            case Type.MySubLayer:
                break;
            case Type.MyButton:
                triggers = ['Press','Release','Enter','Leave'];
                break;
            case Type.MyNumber:
                triggers = ['MaxOverflow','MinOverflow','Enter','Leave'];
                break;
            case Type.MyScriptTrigger:
            case Type.MyProgress:
            case Type.MyDashboard:
                triggers = ['EnterLowAlarm','LeaveLowAlarm','EnterHighAlarm','LeaveHighAlarm','Enter','Leave'];
                break;
            default:
                triggers = ['Enter','Leave']
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
    }

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