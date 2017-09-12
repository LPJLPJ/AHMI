ide.controller("TagCtrl",["$scope","TagService","ProjectService","Type","$uibModal",function(e,t,n,a,o){function i(){e.selectedIdx=-1,e.component={selectedTag:{},allCustomTags:null,allTimerTags:null,visibleOfList:!0,indexOfTagInList:null,timerNum:null,setTag:g,enterTag:s,toggle:d,deleteTag:T,editTag:y,displayTagByIndex:f,displayTimerTagByIndex:p,selectedTagFun:v,setTimerNum:I,restoreTimerNum:N,readTags:x},c(),u(),e.component.allTags=t.getAllTags(),e.status={collapsed:!1},e.$on("AttributeChanged",function(){m(),u()}),e.collapse=function(t){e.status.collapsed=!e.status.collapsed},e.openPanel=r,e.addNewTag=function(){r(-1)},m()}function r(n,a){var i;i=a&&"timer"==a?a:"custom",e.selectedIdx=n,e.selectedType=i;var r;r=-1==n?t.getNewTag():"timer"==i?_.cloneDeep(e.component.allTimerTags[n]):_.cloneDeep(e.component.allCustomTags[n]),o.open({animation:e.animationsEnabled,templateUrl:"tagModal.html",controller:"TagInstanceCtrl",size:"sm",resolve:{tag:function(){return r},type:function(){return i},index:function(){return e.selectedIdx}}}).result.then(function(n){-1==e.selectedIdx?t.setUniqueTags(n,l,function(){c()}.bind(this)):"custom"==e.selectedType?t.editTagByIndex(e.selectedIdx,n,function(){c()}.bind(this)):"timer"==e.selectedType&&t.editTimerTagByIndex(e.selectedIdx,n,function(){c()}.bind(this))},function(e){})}function c(){e.component.allCustomTags=t.getAllCustomTags(),e.component.allTimerTags=t.getAllTimerTags(),e.component.allTags=t.getAllTags(),e.component.timerNum=t.getTimerNum()}function l(e,t){for(var n=0;n<t.length;n++)if(e.name==t[n].name)return console.log("equal"),!1;return!0}function s(t){t.preventDefault(),t.stopPropagation(),13==t.keyCode?g():e.component.tag.name+=String.fromCharCode(t.charCode)}function g(){if(e.selected=null,document.getElementById("tagName").disabled)document.getElementById("tagName").disabled=!1,e.component.tag={name:"",register:!1,indexOfRegister:null,writeOrRead:!1,value:null};else{if(""==e.component.tag.name)return void alert("Please enter tag's name");var n=_.cloneDeep(e.component.tag);0==n.register&&(n.indexOfRegister=null,n.writeOrRead="false",n.value=null),t.setUniqueTags(n,function(e,t){for(var a=0;a<t.length;a++)if(n.name==t[a].name)return console.log("equal"),!1;return!0}),e.component.tag={name:"",register:!1,indexOfRegister:null,writeOrRead:!1,value:null}}}function m(){var t=n.getCurrentSelectObject();if(!t.level)return void console.warn("空!");e.component.selectedTag=t.level.tag}function u(){var t=_.cloneDeep(n.getCurrentSelectObject().level);if(!t)return void console.warn("空!");switch(t.type){case a.MyNumber:case a.MySlide:case a.MyProgress:case a.MyDashboard:case a.MyButtonGroup:case a.MyLayer:case a.MyPage:case a.MyNum:case a.MyKnob:case a.MyOscilloscope:case a.MyImage:case a.MySwitch:case a.MyRotateImg:case a.MyScriptTrigger:case a.MySlideBlock:case a.MyVideo:case a.MyAnimation:case a.MyTexNum:e.showTagPanel=!0;break;default:e.showTagPanel=!1}}function d(){e.component.visibleOfList=!e.component.visibleOfList}function T(a){for(var o=n.getRequiredTagNames(),i=0;i<o.length;i++)if(e.component.allCustomTags[a].name==o[i])return void toastr.warning("该tag已经被使用");switch(e.component.allCustomTags[a].type){case"system":return void toastr.warning("系统变量不可删除")}t.deleteTagByIndex(a,function(){c()}.bind(this))}function f(n){document.getElementById("tagName").disabled=!1,e.component.tag=_.cloneDeep(t.getTagByIndex(n.$index)),e.component.indexOfTagInList=n.$index,e.selected=n.$id}function p(n){document.getElementById("tagName").disabled=!0,e.component.tag=_.cloneDeep(t.getTimerTagByIndex(n.$index)),e.component.indexOfTagInList=n.$index,e.selected=n.$id}function y(){if(console.log("edit success"),!t.getAllCustomTags().length&&!t.getAllTimerTags().length||""==e.component.tag.name)return void alert("Not selected tag!");0==e.component.tag.register&&(e.component.tag.indexOfRegister=null,e.component.tag.writeOrRead=!1,e.component.tag.value=null),e.component.tag.name.match("SysTmr_")?t.editTimerTagByIndex(e.component.indexOfTagInList,e.component.tag):t.editTagByIndex(e.component.indexOfTagInList,e.component.tag)}function v(){n.ChangeAttributeTag(e.component.selectedTag,function(t){e.$emit("ChangeCurrentPage",t)})}function x(){c()}function I(n){if(13===n.keyCode){var a=t.getTimerNum();if(!_.isInteger(parseInt(e.component.timerNum)))return toastr.warning("输入不合法"),void(e.component.timerNum=a);if(e.component.timerNum>10||e.component.timerNum<0)return toastr.warning("超出范围"),void(e.component.timerNum=a);t.setTimerNum(e.component.timerNum),t.setTimerTags(e.component.timerNum)}}function N(){e.component.timerNum=t.getTimerNum()}e.$on("GlobalProjectReceived",function(){i()})}]),ide.controller("TagInstanceCtrl",["$scope","$uibModalInstance","TagService","ProjectService","tag","type","index",function(e,t,n,a,o,i,r){function c(){return(!o.name||""==o.name)&&(alert("请输入Tag名称"),!0)}e.tag=o,e.type=i,e.save=function(){if(-1!==r){var o=n.getTagByIndex(r);if(o.name!==e.tag.name)for(var i=a.getRequiredTagNames(),l=0;l<i.length;l++)if(o.name===i[l])return void toastr.warning("该tag已经被使用,修改名称请先解除绑定")}c()||t.close(e.tag)},e.cancel=function(){t.dismiss("cancel")},e.checkTagIndex=function(){(e.tag.indexOfRegister>65535||e.tag.indexOfRegister<0)&&(toastr.warning("序号超出范围"),e.tag.indexOfRegister=0),_.isInteger(e.tag.indexOfRegister)||(toastr.error("序号只能是整数"),e.tag.indexOfRegister=0)}}]);