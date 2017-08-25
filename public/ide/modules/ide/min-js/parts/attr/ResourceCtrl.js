ide.controller("ResourceCtrl",["ResourceService","$scope","$timeout","ProjectService","Type","CanvasService","$uibModal",function(e,o,t,n,c,l,r){function s(){o.component={top:{uploadingArray:[],files:[],deleteFile:p,toggleOperation:i,basicUrl:"",resources:[],showDel:!0,selectIndexArr:[],selectAll:a,oppSelect:u,allSelected:!1,unSelAll:m,imageType:d}},o.component.top.resources=e.getAllResource(),o.component.top.basicUrl=e.getResourceUrl(),o.component.top.maxSize=e.getMaxTotalSize(),o.component.top.files=e.getAllCustomResources(),o.component.top.totalSize=e.getCurrentTotalSize(),o.openPanel=function(e,t){o.resIndex=e,r.open({animation:!0,templateUrl:"deletePanelModal.html",controller:"deleteResCtrl",size:"sm",resolve:{selectedResIndex:function(){return o.resIndex}}}).result.then(function(e){var o=[];if(_.isNumber(e))o.push(e),p(o);else if(_.isArray(e)){for(var n in e)e[n]&&o.push(Number(n));p(o),t&&t()}})}}function p(t){var c,l=n.getRequiredResourceNames(),r=_.cloneDeep(o.component.top.files),s=[],p=!0;for(c=0;c<t.length;c++){var i=t[c];p=l.every(function(e){return e!==r[i].src}),p?(s=r[i].id,e.deleteFileById(s,function(){o.$emit("ResourceUpdate")}.bind(this))):toastr.warning("资源-"+r[i].name+"已经被使用")}}function i(e){var t=!1,n=_.cloneDeep(o.component.top.selectIndexArr);switch(e){case"operate":o.component.top.showDel=!o.component.top.showDel;break;case"cancel":o.component.top.unSelAll(),o.component.top.selectIndexArr=[],o.component.top.showDel=!o.component.top.showDel;break;case"delete":t=!n.every(function(e){return!e}),t?(o.openPanel(n,function(){o.component.top.selectIndexArr=[]}),o.component.top.unSelAll()):toastr.warning("未选择文件！")}}function a(e){for(var t=0;t<o.component.top.files.length;t++)o.component.top.selectIndexArr[t]=e}function u(){o.component.top.unSelAll();for(var e=0;e<o.component.top.files.length;e++)null==o.component.top.selectIndexArr[e]?o.component.top.selectIndexArr[e]=!0:o.component.top.selectIndexArr[e]=!o.component.top.selectIndexArr[e]}function m(){o.component.top.allSelected=!1}function d(e){return e.type.match(/image/)?1:e.src.match(/ttf/)||e.src.match(/woff/)?2:1}o.$on("GlobalProjectReceived",function(){s()}),o.$on("ResourceChanged",function(){o.component.top.files=e.getAllCustomResources(),o.component.top.totalSize=e.getCurrentTotalSize(),o.$emit("ChangeCurrentPage")})}]).controller("deleteResCtrl",["$scope","$uibModalInstance","selectedResIndex",function(e,o,t){e.confirm=function(){o.close(t)},e.cancel=function(){o.dismiss("cancel")}}]);