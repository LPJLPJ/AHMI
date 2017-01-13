ide.controller("NavCtrl",["$scope","$timeout","GlobalService","NavService","saveProjectModal","ProjectService","TemplateProvider","ProjectFileManage","Type","CanvasService","$uibModal","OperateQueService","TagService","ResourceService","TimerService","$http","ProjectTransformService","RenderSerive","LinkPageWidgetsService","NavModalCANConfigService",function(e,t,o,n,r,a,i,c,l,s,u,d,f,g,p,m,v,j,w,C){function h(){window.local&&(ce=require("path"),le=require("fs"),se=global.__dirname)}function S(){e.component={nav:{currentNav:-1,navs:[{name:"文件"},{name:"开始"},{name:"编辑"},{name:"格式"},{name:"视图"},{name:"帮助"}],changeNav:M},tool:{toolShow:!1,operateQueStatus:d.getOperateQueStatus(),deleteStatus:!1,sublayerStatus:!1,undo:E,redo:R,copy:B,cut:x,paste:Q,selectAll:J,clearAll:G,addLayer:U,addSubLayer:W,deleteObject:z,addWidget:F,openProject:V,generateDataFile:q,play:K,openPanel:ee,openCANPanel:oe,runSimulator:Y,closeSimulator:X,saveProject:O.bind(null,null,!0),showLeft:b,showRight:I,showBottom:P,rotateCanvasLeft:T,rotateCanvasRight:D},simulator:{show:!1}}}function y(){a.getProjectTo(e),e.$on("NavStatusChanged",k)}function N(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show())}function A(){window.spinner&&window.spinner.hide()}function b(){e.$emit("ChangeShownArea",0)}function I(){e.$emit("ChangeShownArea",1)}function P(){e.$emit("ChangeShownArea",2)}function T(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(270deg);left:0;top:0",t.style.cssText="transform:rotate(270deg);left:0;top:0",o.style.cssText="transform:rotate(270deg);left:0;top:0"}function D(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(0deg);left:0;top:0",t.style.cssText="transform:rotate(0deg);left:0;top:0",o.style.cssText="transform:rotate(0deg);left:0;top:0"}function L(){if(window.local){var e=nw.Window.get(),t=!1;e.on("close",function(o){t||(t=!0,te()?e.close(!0):(t=!0,Z(function(){O(function(){e.close(!0)}.bind(this),!0)}.bind(this),function(){e.close(!0)}.bind(this))))}.bind(this))}else window.addEventListener("beforeunload",function(e){te()?console.log("projects have been saved"):e.returnValue="请确定已保存您的工程"})}function $(e,t,o,n,r,a){var i=new Image;i.src=e,i.onload=function(){var e=i.width,c=i.height,l=s.getOffCanvas();l.width=o,l.height=n;var u=l.getContext("2d");if(r){var d=e>c;if(d){var f=1*c/e*o,g=(n-f)/2;u.drawImage(i,0,g,o,f)}else{var p=1*e/c*n,m=(o-p)/2;u.drawImage(i,m,0,p,n)}}else u.drawImage(i,0,0,o,n);var v=t[0];"jpeg"==v?a&&a(l.toDataURL("image/jpeg",t[1]||.8)):a&&a(l.toDataURL("image/png"))},i.onerror=function(){a&&a("")}}function O(t,o){o&&N();var n=a.SaveCurrentOperate();a.changeCurrentPageIndex(0,function(){var r={};a.getProjectCopyTo(r),r.project.resourceList=g.getAllResource(),r.project.customTags=f.getAllCustomTags(),r.project.timerTags=f.getAllTimerTags(),r.project.timers=f.getTimerNum(),r.project.version=window.ideVersion,r.project.CANId=C.getCANId();var i=r.project;console.log("currentProject",i);var c=_.cloneDeep(i.pages[0].url);$(c,["jpeg"],200,200,!0,function(r){function c(e,t){m({method:"POST",url:"/project/"+i.projectId+"/thumbnail",data:{thumbnail:e}}).success(function(e){console.log(e),t&&t()}).error(function(e){console.log(e),toastr.warning("上传失败")})}function l(t,o){var n=new Buffer(t.split(",")[1],"base64"),r=e.project.projectUrl||ce.join(se,"localproject",i.projectId),a=ce.join(r,"thumbnail.jpg");try{le.writeFileSync(a,n),o&&o()}catch(e){o&&o(e)}}_.forEach(i.pages,function(e){e.url="",_.forEach(e.layers,function(e){e.url="",e.showSubLayer.url="",_.forEach(e.subLayers,function(e){e.url=""})})}),window.local?l(r,function(){var r=g.getProjectUrl(),c=ce.join(r,"project.json");try{var l=JSON.parse(le.readFileSync(c));l.thumbnail=ce.join(r,"thumbnail.jpg"),l.content=JSON.stringify(i),le.writeFileSync(c,JSON.stringify(l)),toastr.info("保存成功"),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject"),t&&t()})}catch(t){toastr.warning("保存失败"),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject")})}o&&A()}):c(r,function(){m({method:"PUT",url:"/project/"+i.projectId+"/save",data:{project:i}}).success(function(r){"ok"==r?toastr.info("保存成功"):toastr.warning("保存失败"),o&&A(),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject"),t&&t()})}).error(function(t){console.log(t),toastr.warning("保存失败"),o&&A(),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject")})})})})})}function M(t){t!=e.component.nav.currentNav?(e.component.nav.currentNav=t,e.component.tool.toolShow=!0):e.component.tool.toolShow=!e.component.tool.toolShow,e.$emit("ChangeToolShow",e.component.tool.toolShow),e.$broadcast("ChangeToolShow",e.component.tool.toolShow)}function k(){t(function(){e.component.tool.operateQueStatus=n.getOperateQueStatus(),e.component.tool.deleteStatus=n.getDeleteStatus(),e.component.tool.layerStatus=n.getLayerStatus(),e.component.tool.widgetStatus=n.getWidgetStatus(),e.component.tool.copyStatus=n.getCopyStatus(),e.component.tool.pasteStatus=n.getPasteStatus(),e.component.tool.sublayerStatus=n.getSubLayerStatus()})}function U(){if(!n.getLayerStatus())return void console.warn("不在对应模式");var o=a.SaveCurrentOperate(),r=i.getDefaultLayer();a.AddNewLayerInCurrentPage(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function W(){if(n.getSubLayerStatus()){var o=a.SaveCurrentOperate(),r=i.getDefaultSubLayer();a.AddNewSubLayerInCurrentLayer(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}}function F(o){if(n.getWidgetStatus()){var r=a.SaveCurrentOperate(),c=null;if(0==o)c=i.getDefaultSlide();else if(2==o)c=i.getDefaultProgress();else if(3==o)c=i.getDefaultDashboard();else if(8==o)c=i.getDefaultButton();else if(10==o)c=i.getDefaultButtonGroup();else if(7==o)c=i.getDefaultTextArea();else if(6==o)c=i.getDefaultNum();else if(1==o)c=i.getDefaultSwitch();else if(4==o)c=i.getDefaultRotateImg();else if(5==o)c=i.getDefaultDateTime();else if(11==o)c=i.getDefaultScriptTrigger();else if(9==o)c=i.getDefaultSlideBlock();else{if(12!=o)return;c=i.getDefaultVideo()}c.name==e.oldWidget.name?(e.oldWidget.coordinate+=20,c.info.left=e.oldWidget.coordinate,c.info.top=e.oldWidget.coordinate):(e.oldWidget.name=c.name,e.oldWidget.coordinate=0),a.AddNewWidgetInCurrentSubLayer(c,function(){toastr.info("添加Widget成功"),t(function(){e.$emit("ChangeCurrentSubLayer",r)})},function(e){})}}function E(){n.DoUndo(function(){e.$emit("Undo")})}function R(){n.DoRedo(function(){e.$emit("Redo")})}function B(t){n.DoCopy(function(){e.$emit("DoCopy"),t&&t()})}function x(){B(function(){z()})}function J(e){a.OnSelectAll(e)}function G(){J(function(){z()})}function Q(){var o=a.SaveCurrentOperate();n.DoPaste(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function z(){var o=a.SaveCurrentOperate();n.DoDelete(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function V(){c.OpenProject(function(){})}function q(t){if("local"==t){var o={};a.getProjectCopyTo(o),o.project.resourceList=g.getAllResource(),o.project.customTags=f.getAllCustomTags(),o.project.timerTags=f.getAllTimerTags(),o.project.timers=f.getTimerNum(),o.project.version=window.ideVersion,o.project.CANId=C.getCANId();o.project;window.spinner.show(),m({method:"POST",url:"/project/"+e.project.projectId+"/generateLocalProject"}).success(function(t,o,n){console.log(t),window.spinner.hide(),"ok"==t?(toastr.info("生成本地版成功"),window.location.href="/project/"+e.project.projectId+"/downloadLocalProject"):toastr.error("生成失败")}).error(function(e,t,o){console.log(e)})}else H(t),window?(window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show()),j.renderProject(window.projectData,function(){toastr.info("生成成功"),window.spinner&&window.spinner.hide()},function(){toastr.info("生成失败"),window.spinner&&window.spinner.hide()})):O(function(){N(),m({method:"POST",url:"/project/"+e.project.projectId+"/generate",data:{dataStructure:window.projectData}}).success(function(t,o,n){A(),"ok"==t?(toastr.info("生成成功"),window.location.href="/project/"+e.project.projectId+"/download"):(console.log(t),toastr.info("生成失败"))}).error(function(e,t,o){A(),console.log(e),toastr.info("生成失败")})})}function H(e){var t={};a.getProjectCopyTo(t),t.project=v.transDataFile(t.project),t.project.format=e,t.project.resourceList=_.cloneDeep(g.getAllResource()),t.project.basicUrl=g.getResourceUrl(),t.project.tagList=f.getAllTags(),t.project.timers=f.getTimerNum(),t.project.CANId=C.getCANId();for(var o=0;o<t.project.pageList.length;o++)w.linkPageAllWidgets(t.project.pageList[o]);window.projectData=t.project}function K(){H(),window.cachedResourceList=g.getGlobalResources(),e.component.simulator.show=!0}function X(){e.component.simulator.show=!1}function Y(){}function Z(t,o){var n=u.open({animation:e.animationsEnabled,templateUrl:"navModalCloseWindow.html",controller:"NavModalCloseWindwoCtl",size:"md",backdrop:"static",resolve:{}});n.result.then(function(e){t&&t()},function(){o&&o()})}function ee(){var t=u.open({animation:e.animationsEnabled,templateUrl:"navModal.html",controller:"NavModalCtl",size:"md",resolve:{}});t.result.then(function(e){q(e.format)},function(){console.log("Modal dismissed at: "+new Date)})}function te(){var e=!1;return"true"===document.getElementById("saveFlag").value&&(e=!0),e}function oe(){var t;if(window.local){var o=ne("CAN").map(function(e){return JSON.parse(e)}),t=o.map(function(e){return{name:e.name,id:e._id}}),n=u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}});n.result.then(function(e){if(e){for(var t=null,n=0;n<o.length;n++)if(o[n]._id==e){t=JSON.parse(o[n].content);break}t?ae(e,t):toastr.error("导入失败")}else ie()},function(){})}else m({method:"GET",url:"/CANProject/names"}).success(function(o,n,r){t=o;var a=u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}});a.result.then(function(e){e?ae(e):ie()},function(){})}).error(function(e){console.log("err",e),toastr.warning("获取失败")})}function ne(e){var t,o,n=ce.join(se,"localproject","localCANProject");switch(e){case"CAN":t=n,o="CANProject.json";break;case"normal":default:t=localProjectDir,o="project.json"}var r=[];try{var a=le.statSync(t);if(a&&a.isDirectory())for(var i=le.readdirSync(t),c=0;c<i.length;c++){var l=ce.join(t,i[c]),s=re(ce.join(l,o),!0);s&&r.push(s)}}catch(e){}return r}function re(e,t){if(!t)return le.readFileSync(e,"utf-8");try{var o=le.statSync(e);return o&&o.isFile()?le.readFileSync(e,"utf-8"):null}catch(e){return null}}function ae(t,o){if(window.local){var n=ce.join(se,"localproject",e.project.projectId,"resources");try{var r=le.statSync(n);if(r.isDirectory()){var a=ce.join(n,"CANFile.json");le.writeFileSync(a,JSON.stringify(o,null,4)),toastr.info("导入成功")}else toastr.error("导入失败")}catch(e){toastr.error("导入失败")}}else m({method:"POST",url:"/CANProject/"+t+"/importCANFile",data:{projectId:e.project.projectId}}).success(function(e,t,o){"ok"==e&&toastr.info("导入成功")}).error(function(e,t,o){console.log("导入失败",e)})}function ie(){if(window.local){var t=ce.join(se,"localproject",e.project.projectId,"resources");try{var o=le.statSync(t);if(o.isDirectory()){var n=ce.join(t,"CANFile.json");le.unlink(n,function(e){e?toastr.error("取消失败"):toastr.info("取消CAN配置")})}else toastr.error("取消失败")}catch(e){toastr.error("取消失败")}}else m({method:"POST",url:"/CANProject/"+e.project.projectId+"/deleteCANFile",data:{}}).success(function(e,t,o){"ok"==e&&toastr.info("取消CAN配置")}).error(function(e,t,o){console.log("删除失败",e)})}var ce,le,se;h(),S(),L(),e.$on("GlobalProjectReceived",function(){y(),e.$emit("LoadUp")}),e.oldWidget={name:"",coordinate:0}}]),ide.controller("NavModalCtl",["$scope","$uibModalInstance",function(e,t){e.formats=[{type:"normal",name:"默认"},{type:"dxt3",name:"压缩"}];var o={type:"local",name:"本地"};window.local||(e.formats[2]=o),e.generateFormat="normal",e.ok=function(){t.close({format:e.generateFormat})},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCloseWindwoCtl",["$scope","$uibModalInstance",function(e,t){e.ok=function(){t.close()},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCANConfig",["$scope","$uibModalInstance","data","NavModalCANConfigService",function(e,t,o,n){e.CANInfo=o,e.selectCANId=n.getCANId(),e.ok=function(){null==e.selectCANId&&null==n.getCANId()?t.dismiss("cancel"):(n.setCANId(e.selectCANId),t.close(e.selectCANId))},e.cancel=function(){t.dismiss("cancel")}}]),ide.service("NavModalCANConfigService",[function(){var e;this.setCANId=function(t){e=t},this.getCANId=function(){return e||""}}]);