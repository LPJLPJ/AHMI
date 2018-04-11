ide.controller("ResourceCtrl",["ResourceService","$scope","$timeout","ProjectService","Type","CanvasService","$uibModal",function(e,o,n,t,r,l,c){function s(){o.component={top:{uploadingArray:[],files:[],deleteFile:i,toggleOperation:p,basicUrl:"",resources:[],showDel:!0,selectIndexArr:[],selectAll:a,oppSelect:u,allSelected:!1,unSelAll:m,imageType:f,mask:[]}},o.component.top.resources=e.getAllResource(),o.component.top.basicUrl=e.getResourceUrl(),o.component.top.maxSize=e.getMaxTotalSize(),o.component.top.files=e.getAllCustomResources(),o.component.top.totalSize=e.getCurrentTotalSize(),o.openPanel=function(e,n){o.resIndex=e,c.open({animation:!0,templateUrl:"deletePanelModal.html",controller:"deleteResCtrl",size:"sm",resolve:{selectedResIndex:function(){return o.resIndex}}}).result.then(function(e){var o=[];if(_.isNumber(e))o.push(e),i(o);else if(_.isArray(e)){for(var t in e)e[t]&&o.push(Number(t));i(o),n&&n()}})}}function i(n){var r,l=t.getRequiredResourceNames(),c=_.cloneDeep(o.component.top.files),s=[],i=!0;for(r=0;r<n.length;r++){var p=n[r];i=l.every(function(e){return e!==c[p].src}),i?(s=c[p].id,e.deleteFileById(s,function(){o.$emit("ResourceUpdate")}.bind(this))):toastr.warning("资源-"+c[p].name+"已经被使用")}}function p(e){var n=!1,t=_.cloneDeep(o.component.top.selectIndexArr);switch(e){case"operate":o.component.top.showDel=!o.component.top.showDel;break;case"cancel":o.component.top.unSelAll(),o.component.top.selectIndexArr=[],o.component.top.showDel=!o.component.top.showDel;break;case"delete":n=!t.every(function(e){return!e}),n?(o.openPanel(t,function(){o.component.top.selectIndexArr=[]}),o.component.top.unSelAll()):toastr.warning("未选择文件！")}}function a(e){for(var n=0;n<o.component.top.files.length;n++)o.component.top.selectIndexArr[n]=e}function u(){o.component.top.unSelAll();for(var e=0;e<o.component.top.files.length;e++)null==o.component.top.selectIndexArr[e]?o.component.top.selectIndexArr[e]=!0:o.component.top.selectIndexArr[e]=!o.component.top.selectIndexArr[e]}function m(){o.component.top.allSelected=!1}function f(e){return e.type.match(/image/)?1:e.type.match(/font/)?2:1}o.$on("GlobalProjectReceived",function(){s()}),o.$on("ResourceChanged",function(){o.component.top.files=e.getAllCustomResources(),o.component.top.totalSize=e.getCurrentTotalSize(),o.$emit("ChangeCurrentPage")});var d,g=!0;o.store=function(e){console.log("store",e),d=e.file.name},o.restore=function(e){e.file.name=d,console.log("restore")},o.enterName=function(e){if(console.log("enterName"),e.file.name!==d){if(!(g=t.resourceValidate(e.file.name)))return console.log("input error!"),void o.restore(e);toastr.info("修改成功"),d=e.file.name}},o.enterPress=function(e,n){13==e.keyCode&&o.enterName(n)}}]).controller("deleteResCtrl",["$scope","$uibModalInstance","selectedResIndex",function(e,o,n){e.confirm=function(){o.close(n)},e.cancel=function(){o.dismiss("cancel")}}]);