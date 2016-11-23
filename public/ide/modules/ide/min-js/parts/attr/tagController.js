ide.controller("TagCtrl",["$scope","TagService","ProjectService","Type","$uibModal",function(e,t,n,a,o){function i(){e.selectedIdx=-1,e.component={selectedTag:{},allCustomTags:null,allTimerTags:null,visibleOfList:!0,indexOfTagInList:null,timerNum:null,setTag:g,enterTag:r,toggle:d,deleteTag:T,editTag:y,displayTagByIndex:p,displayTimerTagByIndex:f,selectedTagFun:v,setTimerNum:I,restoreTimerNum:N,readTags:x},c(),u(),e.component.allTags=t.getAllTags(),e.status={collapsed:!1},e.$on("AttributeChanged",function(){m(),u()}),e.collapse=function(t){e.status.collapsed=!e.status.collapsed},e.openPanel=l,e.addNewTag=function(){l(-1)}}function l(n,a){var i;i=a&&"timer"==a?a:"custom",e.selectedIdx=n,e.selectedType=i;var l;l=n==-1?t.getNewTag():"timer"==i?_.cloneDeep(e.component.allTimerTags[n]):_.cloneDeep(e.component.allCustomTags[n]);var r=o.open({animation:e.animationsEnabled,templateUrl:"tagModal.html",controller:"TagInstanceCtrl",size:"sm",resolve:{tag:function(){return l},type:function(){return i}}});r.result.then(function(n){console.log(n),e.selectedIdx==-1?t.setUniqueTags(n,s,function(){c()}.bind(this)):"custom"==e.selectedType?t.editTagByIndex(e.selectedIdx,n,function(){c()}.bind(this)):"timer"==e.selectedType&&t.editTimerTagByIndex(e.selectedIdx,n,function(){c()}.bind(this))},function(e){console.log("Modal dismissed at: "+new Date)})}function c(){e.component.allCustomTags=t.getAllCustomTags(),e.component.allTimerTags=t.getAllTimerTags(),e.component.allTags=t.getAllTags(),e.component.timerNum=t.getTimerNum()}function s(e,t){for(var n=0;n<t.length;n++)if(e.name==t[n].name)return console.log("equal"),!1;return!0}function r(t){t.preventDefault(),t.stopPropagation(),13==t.keyCode?g():e.component.tag.name+=String.fromCharCode(t.charCode)}function g(){if(e.selected=null,document.getElementById("tagName").disabled)document.getElementById("tagName").disabled=!1,e.component.tag={name:"",register:!1,indexOfRegister:null,writeOrRead:!1,value:null};else{if(""==e.component.tag.name)return void alert("Please enter tag's name");var n=_.cloneDeep(e.component.tag);0==n.register&&(n.indexOfRegister=null,n.writeOrRead="false",n.value=null),t.setUniqueTags(n,function(e,t){for(var a=0;a<t.length;a++)if(n.name==t[a].name)return console.log("equal"),!1;return!0}),e.component.tag={name:"",register:!1,indexOfRegister:null,writeOrRead:!1,value:null}}}function m(){var t=n.getCurrentSelectObject();return t.level?void(e.component.selectedTag=t.level.tag):void console.warn("空!")}function u(){var t=_.cloneDeep(n.getCurrentSelectObject().level);if(!t)return void console.warn("空!");switch(t.type){case a.MyButton:case a.MyNumber:case a.MySlide:case a.MyProgress:case a.MyDashboard:case a.MyButtonGroup:case a.MyLayer:case a.MyPage:case a.MyNum:case a.MyKnob:case a.MyOscilloscope:case a.MyImage:case a.MySwitch:case a.MyRotateImg:case a.MyScriptTrigger:case a.MySlideBlock:case a.MyVideo:e.showTagPanel=!0;break;default:e.showTagPanel=!1}}function d(){e.component.visibleOfList=!e.component.visibleOfList}function T(a){for(var o=n.getRequiredTagNames(),i=0;i<o.length;i++)if(e.component.allCustomTags[a].name==o[i])return void toastr.warning("该tag已经被使用");switch(e.component.allCustomTags[a].type){case"system":return void toastr.warning("系统变量不可删除")}t.deleteTagByIndex(a,function(){c()}.bind(this))}function p(n){document.getElementById("tagName").disabled=!1,e.component.tag=_.cloneDeep(t.getTagByIndex(n.$index)),e.component.indexOfTagInList=n.$index,e.selected=n.$id}function f(n){document.getElementById("tagName").disabled=!0,e.component.tag=_.cloneDeep(t.getTimerTagByIndex(n.$index)),e.component.indexOfTagInList=n.$index,e.selected=n.$id}function y(){if(console.log("edit success"),!t.getAllCustomTags().length&&!t.getAllTimerTags().length||""==e.component.tag.name)return void alert("Not selected tag!");0==e.component.tag.register&&(e.component.tag.indexOfRegister=null,e.component.tag.writeOrRead=!1,e.component.tag.value=null);var n=e.component.tag.name;n.match("SysTmr_")?t.editTimerTagByIndex(e.component.indexOfTagInList,e.component.tag):t.editTagByIndex(e.component.indexOfTagInList,e.component.tag)}function v(){n.ChangeAttributeTag(e.component.selectedTag)}function x(){c()}function I(n){if(13===n.keyCode){var a=t.getTimerNum();if(!_.isInteger(parseInt(e.component.timerNum)))return toastr.warning("输入不合法"),void(e.component.timerNum=a);if(e.component.timerNum>10||e.component.timerNum<0)return toastr.warning("超出范围"),void(e.component.timerNum=a);t.setTimerNum(e.component.timerNum),t.setTimerTags(e.component.timerNum)}}function N(){e.component.timerNum=t.getTimerNum()}e.$on("GlobalProjectReceived",function(){i()})}]),ide.controller("TagInstanceCtrl",["$scope","$uibModalInstance","tag","type",function(e,t,n,a){function o(){return(!n.name||""==n.name)&&(alert("请输入Tag名称"),!0)}e.tag=n,e.type=a,e.save=function(){o()||t.close(e.tag)},e.cancel=function(){t.dismiss("cancel")},e.checkTagIndex=function(){(e.tag.indexOfRegister>65535||e.tag.indexOfRegister<0)&&(toastr.warning("序号超出范围"),e.tag.indexOfRegister=0)}}]);