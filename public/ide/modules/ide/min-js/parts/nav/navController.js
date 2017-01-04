ide.controller("NavCtrl",["$scope","$timeout","GlobalService","NavService","saveProjectModal","ProjectService","TemplateProvider","ProjectFileManage","Type","CanvasService","$uibModal","OperateQueService","TagService","ResourceService","TimerService","$http","ProjectTransformService","RenderSerive","LinkPageWidgetsService","NavModalCANConfigService",function(e,t,o,n,r,a,i,c,l,u,s,d,f,g,p,m,v,w,C,h){function S(){window.local&&(ae=require("path"),ie=require("fs"),ce=global.__dirname)}function j(){e.component={nav:{currentNav:-1,navs:[{name:"文件"},{name:"开始"},{name:"编辑"},{name:"格式"},{name:"视图"},{name:"帮助"}],changeNav:M},tool:{toolShow:!1,operateQueStatus:d.getOperateQueStatus(),deleteStatus:!1,sublayerStatus:!1,undo:R,redo:B,copy:F,cut:x,paste:z,selectAll:G,clearAll:Q,addLayer:U,addSubLayer:k,deleteObject:J,addWidget:E,openProject:V,generateDataFile:q,play:K,openPanel:ee,openCANPanel:oe,runSimulator:Y,closeSimulator:X,saveProject:O.bind(null,null,!0),showLeft:A,showRight:I,showBottom:P,rotateCanvasLeft:D,rotateCanvasRight:T},simulator:{show:!1}}}function N(){a.getProjectTo(e),e.$on("NavStatusChanged",W)}function y(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show())}function b(){window.spinner&&window.spinner.hide()}function A(){e.$emit("ChangeShownArea",0)}function I(){e.$emit("ChangeShownArea",1)}function P(){e.$emit("ChangeShownArea",2)}function D(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(270deg);left:0;top:0",t.style.cssText="transform:rotate(270deg);left:0;top:0",o.style.cssText="transform:rotate(270deg);left:0;top:0"}function T(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(0deg);left:0;top:0",t.style.cssText="transform:rotate(0deg);left:0;top:0",o.style.cssText="transform:rotate(0deg);left:0;top:0"}function L(){if(window.local){var e=nw.Window.get(),t=!1;e.on("close",function(o){t||(t=!0,te()?e.close(!0):(t=!0,Z(function(){O(function(){e.close(!0)}.bind(this),!0)}.bind(this),function(){e.close(!0)}.bind(this))))}.bind(this))}else window.addEventListener("beforeunload",function(e){te()?console.log("projects have been saved"):e.returnValue="请确定已保存您的工程"})}function $(e,t,o,n,r,a){var i=new Image;i.src=e,i.onload=function(){var e=i.width,c=i.height,l=u.getOffCanvas();l.width=o,l.height=n;var s=l.getContext("2d");if(r){var d=e>c;if(d){var f=1*c/e*o,g=(n-f)/2;s.drawImage(i,0,g,o,f)}else{var p=1*e/c*n,m=(o-p)/2;s.drawImage(i,m,0,p,n)}}else s.drawImage(i,0,0,o,n);var v=t[0];"jpeg"==v?a&&a(l.toDataURL("image/jpeg",t[1]||.8)):a&&a(l.toDataURL("image/png"))},i.onerror=function(){a&&a("")}}function O(t,o){o&&y();var n=a.SaveCurrentOperate();a.changeCurrentPageIndex(0,function(){var r={};a.getProjectCopyTo(r),r.project.resourceList=g.getAllResource(),r.project.customTags=f.getAllCustomTags(),r.project.timerTags=f.getAllTimerTags(),r.project.timers=f.getTimerNum(),r.project.version=window.ideVersion,r.project.CANId=h.getCANId();var i=r.project,c=_.cloneDeep(i.pages[0].url);$(c,["jpeg"],200,200,!0,function(r){function c(e,t){m({method:"POST",url:"/project/"+i.projectId+"/thumbnail",data:{thumbnail:e}}).success(function(e){console.log(e),t&&t()}).error(function(e){console.log(e),toastr.warning("上传失败")})}function l(t,o){var n=new Buffer(t.split(",")[1],"base64"),r=e.project.projectUrl||ae.join(ce,"localproject",i.projectId),a=ae.join(r,"thumbnail.jpg");try{ie.writeFileSync(a,n),o&&o()}catch(e){o&&o(e)}}_.forEach(i.pages,function(e){e.url="",_.forEach(e.layers,function(e){e.url="",e.showSubLayer.url="",_.forEach(e.subLayers,function(e){e.url=""})})}),window.local?l(r,function(){var r=g.getProjectUrl(),c=ae.join(r,"project.json");try{var l=JSON.parse(ie.readFileSync(c));l.thumbnail=ae.join(r,"thumbnail.jpg"),l.content=JSON.stringify(i),ie.writeFileSync(c,JSON.stringify(l)),toastr.info("保存成功"),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject"),t&&t()})}catch(t){toastr.warning("保存失败"),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject")})}o&&b()}):c(r,function(){m({method:"PUT",url:"/project/"+i.projectId+"/save",data:{project:i}}).success(function(r){"ok"==r?toastr.info("保存成功"):toastr.warning("保存失败"),o&&b(),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject"),t&&t()})}).error(function(t){console.log(t),toastr.warning("保存失败"),o&&b(),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject")})})})})})}function M(t){t!=e.component.nav.currentNav?(e.component.nav.currentNav=t,e.component.tool.toolShow=!0):e.component.tool.toolShow=!e.component.tool.toolShow,e.$emit("ChangeToolShow",e.component.tool.toolShow),e.$broadcast("ChangeToolShow",e.component.tool.toolShow)}function W(){t(function(){e.component.tool.operateQueStatus=n.getOperateQueStatus(),e.component.tool.deleteStatus=n.getDeleteStatus(),e.component.tool.layerStatus=n.getLayerStatus(),e.component.tool.widgetStatus=n.getWidgetStatus(),e.component.tool.copyStatus=n.getCopyStatus(),e.component.tool.pasteStatus=n.getPasteStatus(),e.component.tool.sublayerStatus=n.getSubLayerStatus()})}function U(){if(!n.getLayerStatus())return void console.warn("不在对应模式");var o=a.SaveCurrentOperate(),r=i.getDefaultLayer();a.AddNewLayerInCurrentPage(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function k(){if(n.getSubLayerStatus()){var o=a.SaveCurrentOperate(),r=i.getDefaultSubLayer();a.AddNewSubLayerInCurrentLayer(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}}function E(o){if(n.getWidgetStatus()){var r=a.SaveCurrentOperate(),c=null;if(0==o)c=i.getDefaultSlide();else if(2==o)c=i.getDefaultProgress();else if(3==o)c=i.getDefaultDashboard();else if(8==o)c=i.getDefaultButton();else if(10==o)c=i.getDefaultButtonGroup();else if(7==o)c=i.getDefaultTextArea();else if(6==o)c=i.getDefaultNum();else if(1==o)c=i.getDefaultSwitch();else if(4==o)c=i.getDefaultRotateImg();else if(5==o)c=i.getDefaultDateTime();else if(11==o)c=i.getDefaultScriptTrigger();else if(9==o)c=i.getDefaultSlideBlock();else{if(12!=o)return;c=i.getDefaultVideo()}c.name==e.oldWidget.name?(e.oldWidget.coordinate+=20,c.info.left=e.oldWidget.coordinate,c.info.top=e.oldWidget.coordinate):(e.oldWidget.name=c.name,e.oldWidget.coordinate=0),a.AddNewWidgetInCurrentSubLayer(c,function(){toastr.info("添加Widget成功"),t(function(){e.$emit("ChangeCurrentSubLayer",r)})},function(e){})}}function R(){n.DoUndo(function(){e.$emit("Undo")})}function B(){n.DoRedo(function(){e.$emit("Redo")})}function F(t){n.DoCopy(function(){e.$emit("DoCopy"),t&&t()})}function x(){F(function(){J()})}function G(e){a.OnSelectAll(e)}function Q(){G(function(){J()})}function z(){var o=a.SaveCurrentOperate();n.DoPaste(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function J(){var o=a.SaveCurrentOperate();n.DoDelete(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function V(){c.OpenProject(function(){})}function q(t){H(t),window?(window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show()),w.renderProject(window.projectData,function(){toastr.info("生成成功"),window.spinner&&window.spinner.hide()},function(){toastr.info("生成失败"),window.spinner&&window.spinner.hide()})):O(function(){y(),m({method:"POST",url:"/project/"+e.project.projectId+"/generate",data:{dataStructure:window.projectData}}).success(function(t,o,n){b(),"ok"==t?(toastr.info("生成成功"),window.location.href="/project/"+e.project.projectId+"/download"):(console.log(t),toastr.info("生成失败"))}).error(function(e,t,o){b(),console.log(e),toastr.info("生成失败")})})}function H(e){var t={};a.getProjectCopyTo(t),t.project=v.transDataFile(t.project),t.project.format=e,t.project.resourceList=_.cloneDeep(g.getAllResource()),t.project.basicUrl=g.getResourceUrl(),t.project.tagList=f.getAllTags(),t.project.timers=f.getTimerNum(),t.project.CANId=h.getCANId();for(var o=0;o<t.project.pageList.length;o++)C.linkPageAllWidgets(t.project.pageList[o]);window.projectData=t.project}function K(){H(),window.cachedResourceList=g.getGlobalResources(),e.component.simulator.show=!0}function X(){e.component.simulator.show=!1}function Y(){}function Z(t,o){var n=s.open({animation:e.animationsEnabled,templateUrl:"navModalCloseWindow.html",controller:"NavModalCloseWindwoCtl",size:"md",backdrop:"static",resolve:{}});n.result.then(function(e){t&&t()},function(){o&&o()})}function ee(){var t=s.open({animation:e.animationsEnabled,templateUrl:"navModal.html",controller:"NavModalCtl",size:"md",resolve:{}});t.result.then(function(e){q(e.format)},function(){console.log("Modal dismissed at: "+new Date)})}function te(){var e=!1;return"true"===document.getElementById("saveFlag").value&&(e=!0),e}function oe(){var t;m({method:"GET",url:"/CANProject/names"}).success(function(o,n,r){t=o;var a=s.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}});a.result.then(function(e){e?ne(e):re()},function(){})}).error(function(e){console.log("err",e),toastr.warning("获取失败")})}function ne(t){m({method:"POST",url:"/CANProject/"+t+"/importCANFile",data:{projectId:e.project.projectId}}).success(function(e,t,o){"ok"==e&&toastr.info("导入成功")}).error(function(e,t,o){console.log("导入失败",e)})}function re(){m({method:"POST",url:"/CANProject/"+e.project.projectId+"/deleteCANFile",data:{}}).success(function(e,t,o){"ok"==e&&toastr.info("取消CAN配置")}).error(function(e,t,o){console.log("删除失败",e)})}var ae,ie,ce;S(),j(),L(),e.$on("GlobalProjectReceived",function(){N(),e.$emit("LoadUp")}),e.oldWidget={name:"",coordinate:0}}]),ide.controller("NavModalCtl",["$scope","$uibModalInstance",function(e,t){e.formats=[{type:"normal",name:"默认"},{type:"dxt3",name:"压缩"}],e.generateFormat="normal",e.ok=function(){t.close({format:e.generateFormat})},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCloseWindwoCtl",["$scope","$uibModalInstance",function(e,t){e.ok=function(){t.close()},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCANConfig",["$scope","$uibModalInstance","data","NavModalCANConfigService",function(e,t,o,n){e.CANInfo=o,e.selectCANId=n.getCANId(),e.ok=function(){null==e.selectCANId&&null==n.getCANId()?t.dismiss("cancel"):(n.setCANId(e.selectCANId),t.close(e.selectCANId))},e.cancel=function(){t.dismiss("cancel")}}]),ide.service("NavModalCANConfigService",[function(){var e;this.setCANId=function(t){e=t},this.getCANId=function(){return e||""}}]);