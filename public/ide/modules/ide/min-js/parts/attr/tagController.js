ide.controller("TagCtrl",["$rootScope","$scope","TagService","ProjectService","Type","$uibModal",function(e,n,t,a,o,s){function r(){u(),A()}function l(){c(-1)}function c(e,o){var r;if("timer"!==(r=o&&"timer"==o?o:"custom"))if(-1!=e){var l=n.component.curTagClass.tagArray[e].name;n.selectedIdx=O(l,n.component.tagClasses[0]),e=n.selectedIdx}else n.selectedIdx=e;n.selectedIdx=e,n.selectedType=r;var c;c=-1==e?t.getNewTag():"timer"==r?_.cloneDeep(n.component.allTimerTags[e]):_.cloneDeep(n.component.allCustomTags[e]),s.open({animation:n.animationsEnabled,templateUrl:"tagModal.html",controller:"TagInstanceCtrl",size:"sm",resolve:{tag:function(){return c},type:function(){return r},index:function(){return n.selectedIdx}}}).result.then(function(o){if(-1==n.selectedIdx)t.setUniqueTags(o,d,function(){u(),g(o,n.component.curTagClass.name)}.bind(this));else if("custom"==n.selectedType){if("force"===o.force){var s=a.SaveCurrentOperate(),r=t.getTagByIndex(e);a.replaceAllRelatedTag(r,o),n.$emit("ChangeCurrentPage",s)}t.editTagByIndex(n.selectedIdx,o,function(){u()}.bind(this)),k(l,o,n.component.curTagClass)}else"timer"==n.selectedType&&t.editTimerTagByIndex(n.selectedIdx,o,function(){u()}.bind(this))},function(e){})}function i(e){for(var t=0;t<n.component.allCustomTags.length;t++)n.component.allCustomTags[t].name===e&&(n.selectedIdx=t);var a=_.cloneDeep(n.component.tagClasses);a.splice(0,2);for(var o,r=0;r<a.length;r++){o=a[r].tagArray;for(var l=0;l<o.length;l++)if(e===o[l].name){a.splice(r,1),r--;break}}var c=a.map(function(e){return e.name});s.open({animation:n.animationsEnabled,templateUrl:"addToTagClassModal.html",controller:["$scope","$uibModalInstance",function(e,n){e.tagClassNames=c,e.save=function(t){void 0===e.curIndex?toastr.warning("未选中任何标签"):n.close(e.tagClassNames[e.curIndex])},e.cancel=function(){n.dismiss("cancel")},e.indexSelected=function(n){e.curIndex=n}}],size:"sm",resolve:{tagClassNames:function(){return c}}}).result.then(function(e){g(n.component.allCustomTags[n.selectedIdx],e)},function(e){})}function g(e,t){for(var a=0;a<n.component.tagClasses.length;a++)if(t===n.component.tagClasses[a].name){for(var o=0;o<n.component.tagClasses[a].tagArray.length;o++)if(n.component.tagClasses[a].tagArray[o].name===e.name)return;return void n.component.tagClasses[a].tagArray.push(e)}}function m(){var e=n.component.tagClasses.map(function(e){return{name:e.name,renamed:!1,renaming:!1,deleted:!1}}),o=e.splice(0,2);s.open({animation:n.animationsEnabled,templateUrl:"editTagClasses.html",controller:["$scope","$uibModalInstance",function(n,t){function s(e){if(null==e)return toastr.error("名称不能为空"),!1;for(var t=0;t<n.tagClassesManage.length;t++)if(e==n.tagClassesManage[t].name&&!1===n.tagClassesManage[t].deleted)return toastr.error("重复的名称"),!1;return!!a.inputValidate(e)}n.tagClassesManage=e,n.defaultTagClasses=o,n.$scopeCtl=n,n.$scopeCtl.curTagClassNewName=null,n.someTagClassRenaming=!1,n.addTagClass=!1,n.addTagClass=function(){n.addTagClassFlag=!0,n.someTagClassRenaming=!0,n.$scopeCtl.curTagClassNewName=null},n.inputName=function(e){if(void 0!==e&&null!==e){var t=n.tagClassesManage[e];t.renaming=!t.renaming,n.$scopeCtl.curTagClassNewName=t.name}else n.addTagClassFlag=!1;n.someTagClassRenaming=!n.someTagClassRenaming},n.enterName=function(e){if(1==s(n.$scopeCtl.curTagClassNewName)){if(e){var t=n.tagClassesManage[e];t.name=n.$scopeCtl.curTagClassNewName,t.renamed=!0,t.renaming=!1}else{var a={name:n.$scopeCtl.curTagClassNewName,renamed:!1,renaming:!1,deleted:!1};n.tagClassesManage.push(a),n.addTagClassFlag=!1}n.someTagClassRenaming=!1}},n.delete=function(e){},n.close=function(){t.close(n.tagClassesManage)}}],size:"md",resolve:{tagClassesManage:function(){return e},defaultTagClasses:function(){return o}}}).result.then(function(e){for(var a=0;a<n.component.tagClasses.length-2;a++)1!=e[a].deleted?1==e[a].renamed&&(n.component.tagClasses[a+2].name=e[a].name):(e.splice(a,1),n.component.tagClasses.splice(a+2,1),a--);if(n.component.tagClasses.length-2<e.length)for(;a<e.length;a++)if(0==e[a].deleted){var o=t.getNewTagClass();o.name=e[a].name,n.component.tagClasses.push(o)}t.syncTagClasses(n.component.tagClasses)},function(e){})}function u(){n.component.allCustomTags=t.getAllCustomTags(),n.component.allTimerTags=t.getAllTimerTags(),n.component.allTags=t.getAllTags(),n.component.timerNum=t.getTimerNum()}function d(e,n){if("custom"===e.type)for(var t=0;t<n.length;t++)if(e.name==n[t].name)return toastr.error("重复的tag名称"),!1;return!0}function f(e){e.preventDefault(),e.stopPropagation(),13==e.keyCode?T():n.component.tag.name+=String.fromCharCode(e.charCode)}function T(){if(n.selected=null,document.getElementById("tagName").disabled)document.getElementById("tagName").disabled=!1,n.component.tag={name:"",register:!1,indexOfRegister:null,writeOrRead:!1,value:null};else{if(""==n.component.tag.name)return void alert("Please enter tag's name");var e=_.cloneDeep(n.component.tag);0==e.register&&(e.indexOfRegister=null,e.writeOrRead="false",e.value=null),t.setUniqueTags(e,function(n,t){for(var a=0;a<t.length;a++)if(e.name==t[a].name)return console.log("equal"),!1;return!0}),n.component.tag={name:"",register:!1,indexOfRegister:null,writeOrRead:!1,value:null}}}function p(){n.component.visibleOfList=!n.component.visibleOfList}function C(e,t){for(var o=a.getRequiredTagNames(),s=0;s<o.length;s++)if(e==o[s])return void toastr.warning("该tag已经被使用");switch(t){case"system":return void toastr.warning("系统变量不可删除")}for(var r,l=0;l<n.component.tagClasses.length;l++)for(r=n.component.tagClasses[l].tagArray,s=0;s<r.length;s++)r[s].name===e&&r.splice(s,1)}function v(e){document.getElementById("tagName").disabled=!1,n.component.tag=_.cloneDeep(t.getTagByIndex(e.$index)),n.component.indexOfTagInList=e.$index,n.selected=e.$id}function y(e){document.getElementById("tagName").disabled=!0,n.component.tag=_.cloneDeep(t.getTimerTagByIndex(e.$index)),n.component.indexOfTagInList=e.$index,n.selected=e.$id}function h(){if(console.log("edit success"),!t.getAllCustomTags().length&&!t.getAllTimerTags().length||""==n.component.tag.name)return void alert("Not selected tag!");0==n.component.tag.register&&(n.component.tag.indexOfRegister=null,n.component.tag.writeOrRead=!1,n.component.tag.value=null),n.component.tag.name.match("SysTmr_")?t.editTimerTagByIndex(n.component.indexOfTagInList,n.component.tag):t.editTagByIndex(n.component.indexOfTagInList,n.component.tag)}function N(){u()}function x(){n.component.timerNum++;var e={};e.keyCode=13,b(e)}function I(){n.component.timerNum--;var e={};e.keyCode=13,b(e)}function b(e){if(13===e.keyCode){var a=t.getTimerNum();if(!_.isInteger(parseInt(n.component.timerNum)))return toastr.warning("输入不合法"),void(n.component.timerNum=a);if(n.component.timerNum>10||n.component.timerNum<0)return toastr.warning("超出范围"),void(n.component.timerNum=a);t.setTimerNum(n.component.timerNum),t.setTimerTags(n.component.timerNum)}}function M(){n.component.timerNum=t.getTimerNum()}function w(e){t.sortByName(function(){u()})}function $(){t.sortByRegister(function(){u()})}function A(){n.component.tagClasses=t.getAllTagClasses(),n.component.tagClasses[0].tagArray=n.component.allCustomTags,n.component.tagClasses[1].tagArray=n.component.allTimerTags,n.component.curTagClass=t.getAllTagClasses()[0],n.component.curTagClassName=t.getAllTagClasses()[0].name}function S(){m()}function R(e){i(e)}function B(){for(var e=n.component.tagClasses,t=n.component.curTagClassName,a=(n.component.tagClasses[0].tagArray,0);a<e.length;a++)if(t===e[a].name){n.component.curTagClass=e[a];break}"定时器"===n.component.curTagClass.name?n.component.timerTagShow=!0:n.component.timerTagShow=!1,P(n.component.curTagClass)}function O(e,n){for(var t=0;t<n.tagArray.length;t++)if(e===n.tagArray[t].name)return t;return-1}function k(e,n,t){var a=O(e,t);t.tagArray[a]=n}function P(e){for(var t=0;t<e.tagArray.length;t++)for(var a=0;a<n.component.allTags.length;a++)e.tagArray[t].name===n.component.allTags[a].name&&(e.tagArray[t]=n.component.allTags[a])}function j(e){if(n.component.curTagClassName!==n.component.tagClasses[0].name){var a=O(e.name,n.component.tagClasses[0]);t.editTagByIndex(a,e,function(){u()})}}function D(){s.open({animation:!0,templateUrl:"tagsImport.html",scope:n,size:"md",resolve:{curTagClass:function(){return n.component.curTagClass}},controller:["$scope","$uibModalInstance","$http","TagService","curTagClass",function(e,n,t,a,o){function s(e){var n=new RegExp(/tags_default\d*$/g),a="";if(n.test(e)&&(a="/public/ide/modules/tagConfig/template/"+e.replace("_",".")+".json",console.log("url",a)),!a)return void console.error("url is empty!");t({method:"get",url:a}).success(function(e){r(null,e)}).error(function(e){r(e,null)})}function r(t,s){if(t)return toastr.error("获取失败，请检查您的网络"),void l();a.syncTagFromRemote(s,o,e.overlay,function(){e.$emit("syncTagSuccess"),n.close()})}function l(){e.btnText="确定"===e.btnText?"导入中...":e.btnText,e.disableBtn="确定"!==e.btnText}e.selectedTagId=null,e.overlay=!1,e.btnText="确定",e.disableBtn=!1,e.ok=function(){if(!e.selectedTagId)return void toastr.warning("请选择一项预设变量");l(),s(e.selectedTagId)},e.cancel=function(){n.dismiss()}}]})}n.selectedIdx=-1,n.component={allCustomTags:null,allTimerTags:null,visibleOfList:!0,indexOfTagInList:null,timerNum:null,tagClasses:null,curTagClass:null,curTagClassName:null,timerTagShow:!1,addNewTag:l,openPanel:c,setTag:T,enterTag:f,toggle:p,deleteTag:C,editTag:h,displayTagByIndex:v,displayTimerTagByIndex:y,setTimerNum:b,addTimerNum:x,minusTimerNum:I,restoreTimerNum:M,readTags:N,sortByName:w,sortByRegister:$,editTagClass:S,changeCurTagClass:B,addToTagClass:R,regCheckboxClick:j,importTags:D},n.$on("GlobalProjectReceived",function(){r()}),n.$on("syncTagSuccess",function(e){console.log("syncTagSuccess"),u(),A()})}]),ide.controller("TagInstanceCtrl",["$scope","$uibModalInstance","TagService","ProjectService","tag","type","index",function(e,n,t,a,o,s,r){e.tag=o,e.type=s,e.showForceEditBtn=!1,e.save=function(o){if(e.showForceEditBtn=!1,"timer"===o.type)return void n.close(e.tag);if(-1!==r){var s=t.getTagByIndex(r);if(s.name!==e.tag.name){for(var l=_.cloneDeep(t.getAllTags()),c=0;c<l.length;c++)if(e.tag.name===l[c].name&&r!=c)return void toastr.error("重复的tag名称");for(var i=a.getRequiredTagNames(),g=0;g<i.length;g++)if(s.name===i[g])return toastr.warning("该tag已经被使用,修改名称请先解除绑定"),void(e.showForceEditBtn=!0)}}if(a.inputValidate(e.tag.name)){if(e.tag.name.match(/^SysTmr_[0-9]+_t$/))return void toastr.error("SysTmr_数字_t 为定时器保留名称");n.close(e.tag)}},e.forceSave=function(o){var s=!1;if(-1!==r){var l=t.getTagByIndex(r);if(l.name!==e.tag.name&&a.inputValidate(e.tag.name)){for(var c=_.cloneDeep(t.getAllTags()),i=0;i<c.length;i++)if(e.tag.name===c[i].name&&r!=i)return void toastr.error("重复的tag名称");if(e.tag.name.match(/^SysTmr_[0-9]+_t$/))return void toastr.error("SysTmr_数字_t 为定时器保留名称");for(var g=a.getRequiredTagNames(),m=0;m<g.length;m++)if(l.name===g[m]){s=!0;break}s&&(console.log("force"),e.tag.force="force",n.close(e.tag))}}},e.cancel=function(){n.dismiss("cancel")},e.checkTagIndex=function(){(e.tag.indexOfRegister>65535||e.tag.indexOfRegister<0)&&(toastr.warning("序号超出范围"),e.tag.indexOfRegister=0),_.isInteger(e.tag.indexOfRegister)||(toastr.error("序号只能是整数"),e.tag.indexOfRegister=0)}}]),ide.controller("TagSelectCtl",["$scope","TagService","ProjectService","Type",function(e,n,t,a){function o(){r(),l()}function s(){e.component.allCustomTags=n.getAllCustomTags(),e.component.allTimerTags=n.getAllTimerTags()}function r(){var n=t.getCurrentSelectObject();if(!n.level)return void console.warn("空!");e.component.selectedTag=n.level.tag,e.selectedTagObj.tagName=n.level.tag}function l(){var n=_.cloneDeep(t.getCurrentSelectObject().level);if(!n)return void console.warn("空!");switch(n.type){case a.MyNumber:case a.MySlide:case a.MyProgress:case a.MyDashboard:case a.MyButtonGroup:case a.MyLayer:case a.MyPage:case a.MyNum:case a.MyKnob:case a.MyOscilloscope:case a.MyImage:case a.MySwitch:case a.MyRotateImg:case a.MyScriptTrigger:case a.MySlideBlock:case a.MyVideo:case a.MyAnimation:case a.MyTexNum:case a.MySelector:case a.MyRotaryKnob:case a.MyColorBlock:e.component.showTagPanel=!0;break;default:e.component.showTagPanel=!1}}function c(){e.component.selectedTag=e.selectedTagObj.tagName,t.ChangeAttributeTag(e.component.selectedTag,function(n){e.$emit("ChangeCurrentPage",n)})}e.component={showTagPanel:!1,selectedTag:null,allCustomTags:null,allTimerTags:null,selectedTagFun:c},e.selectedTagObj={tagName:null},e.$on("GlobalProjectReceived",function(){o()}),e.$on("AttributeChanged",function(){s(),r(),l()}),e.$on("MaskView",function(n,t){e.myMask=t})}]);