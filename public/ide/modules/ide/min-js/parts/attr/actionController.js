ide.controller("ActionCtl",["$scope","ActionService","TagService","$uibModal","ProjectService","Type","OperationService",function(e,t,n,o,c,s,a){function i(){e.status={collapsed:!1},r(),e.tags=n.getAllCustomTags(),e.timerTags=n.getAllTimerTags(),e.collapse=function(t){e.status.collapsed=!e.status.collapsed},e.animationsEnabled=!0}function r(){if(!c.getCurrentSelectObject())return void console.warn("空!");var n=c.getCurrentSelectObject().level,o=_.cloneDeep(n.actions);t.setActions(o),e.actions=t.getAllActions(),e.triggers=t.getTriggers(c.getCurrentSelectObject().level.type);var a=_.cloneDeep(c.getCurrentSelectObject().level);if(!a)return void console.warn("空!");switch(a.type){case s.MyButton:case s.MyNumber:case s.MyProgress:case s.MyDashboard:case s.MyButtonGroup:case s.MySubLayer:case s.MyPage:case s.MyNum:case s.MyImage:case s.MyScriptTrigger:case s.MySlideBlock:e.showActionPanel=!0;break;case s.MySlide:case s.MySwitch:default:e.showActionPanel=!1}switch(a.type){case s.MyPage:e.showAddActionPanel=!0;break;default:e.showAddActionPanel=!1}}function l(){e.$on("AttributeChanged",function(){r()}),e.deleteAction=function(n){t.deleteActionByIndex(n,function(){e.actions=t.getAllActions()}.bind(this))},e.openPanel=function(n){e.selectedIdx=n;var c;-1==n?c=t.getNewAction():n>=0&&n<e.actions.length&&(c=_.cloneDeep(e.actions[n])),o.open({animation:e.animationsEnabled,templateUrl:"actionPanelModal.html",controller:"ActionInstanceCtrl",size:"lg",resolve:{action:function(){return c},triggers:function(){return e.triggers},tags:function(){return e.tags},timerTags:function(){return e.timerTags}}}).result.then(function(n){-1==e.selectedIdx?t.appendAction(n,function(){e.actions=t.getAllActions()}.bind(this)):e.selectedIdx>=0&&e.selectedIdx<e.actions.length&&t.updateActionByIndex(n,e.selectedIdx,function(){e.actions=t.getAllActions()}.bind(this))},function(){console.log("Modal dismissed at: "+new Date)})}}e.$on("GlobalProjectReceived",function(){i(),l(),e.$emit("LoadUp")})}]).controller("ActionInstanceCtrl",["$scope","$uibModalInstance","action","triggers","tags","timerTags","OperationService",function(e,t,n,o,c,s,a){var i=[{name:"",symbol:""},{tag:"",value:""},{tag:"",value:""}];e.ops=a.getOperations(),e.tags=_.map(c.filter(function(e){return"default"==e.bindMod}),"name"),e.timerTags=_.map(s,function(e){return e.name}),e.action=n,e.triggers=o,e.currentChosenIdx=e.action.commands.length-1,e.currentChosenIdx>0?e.chosenCmd=e.action.commands[e.currentChosenIdx]:e.chosenCmd=_.cloneDeep(i),e.showCustomTags=!0,e.changeTagShowState=function(){-1!==e.chosenCmd[0].symbol.indexOf("setTimer")?e.showCustomTags=!1:e.showCustomTags=!0},e.checkValueIsInt=function(){var t=e.chosenCmd[2].value;t&&!_.isInteger(t)&&(toastr.warning("值只能为整数"),e.chosenCmd[2].value=parseInt(t))},e.chooseCmd=function(t){-1!==(e.action.commands[t][0].symbol||"").indexOf("setTimer")?e.showCustomTags=!1:e.showCustomTags=!0,e.currentChosenIdx=t,e.chosenCmd=e.action.commands[t]},e.addNewCmd=function(){e.action.commands.splice(e.currentChosenIdx+1,0,_.cloneDeep(i)),e.currentChosenIdx+=1,e.chosenCmd=e.action.commands[e.currentChosenIdx],""==e.action.trigger&&toastr.error("未选择触发方式！")},e.deleteCmd=function(t){e.action.commands.splice(t,1),e.currentChosenIdx-=1},e.save=function(){t.close(e.action)},e.cancel=function(){t.dismiss("cancel")}}]);