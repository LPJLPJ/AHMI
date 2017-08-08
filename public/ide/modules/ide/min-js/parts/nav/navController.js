ide.controller("NavCtrl",["$scope","$timeout","GlobalService","NavService","saveProjectModal","ProjectService","TemplateProvider","ProjectFileManage","Type","CanvasService","$uibModal","OperateQueService","TagService","ResourceService","TimerService","$http","ProjectTransformService","RenderSerive","LinkPageWidgetsService","NavModalCANConfigService",function(e,t,o,n,r,a,i,c,l,s,u,d,f,g,p,m,v,w,j,h){function C(){a.getProjectTo(e),e.$on("NavStatusChanged",O)}function S(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show())}function A(){window.spinner&&window.spinner.hide()}function N(){e.$emit("ChangeShownArea",0)}function y(){e.$emit("ChangeShownArea",1)}function b(){e.$emit("ChangeShownArea",2)}function P(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(270deg);left:0;top:0",t.style.cssText="transform:rotate(270deg);left:0;top:0",o.style.cssText="transform:rotate(270deg);left:0;top:0"}function I(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(0deg);left:0;top:0",t.style.cssText="transform:rotate(0deg);left:0;top:0",o.style.cssText="transform:rotate(0deg);left:0;top:0"}function T(e,t,o,n,r,a){var i=new Image;i.src=e,i.onload=function(){var e=i.width,c=i.height,l=s.getOffCanvas();l.width=o,l.height=n;var u=l.getContext("2d");if(r){if(e>c){var d=1*c/e*o,f=(n-d)/2;u.drawImage(i,0,f,o,d)}else{var g=1*e/c*n,p=(o-g)/2;u.drawImage(i,p,0,g,n)}}else u.drawImage(i,0,0,o,n);"jpeg"==t[0]?a&&a(l.toDataURL("image/jpeg",t[1]||.8)):a&&a(l.toDataURL("image/png"))},i.onerror=function(){a&&a("")}}function D(t,o){o&&S();var n=a.SaveCurrentOperate();a.changeCurrentPageIndex(0,function(){var r={};a.getProjectCopyTo(r),r.project.resourceList=g.getAllResource(),r.project.customTags=f.getAllCustomTags(),r.project.timerTags=f.getAllTimerTags(),r.project.timers=f.getTimerNum(),r.project.version=window.ideVersion,r.project.CANId=h.getCANId();var i=r.project;T(_.cloneDeep(i.pages[0].url),["jpeg"],200,200,!0,function(r){_.forEach(i.pages,function(e){e.url="",_.forEach(e.layers,function(e){e.url="",e.showSubLayer.url="",_.forEach(e.subLayers,function(e){e.url=""})})}),window.local?function(t,o){var n=new Buffer(t.split(",")[1],"base64"),r=e.project.projectUrl||ae.join(ce,"localproject",i.projectId),a=ae.join(r,"thumbnail.jpg");try{ie.writeFileSync(a,n),o&&o()}catch(e){o&&o(e)}}(r,function(){var r=g.getProjectUrl(),c=ae.join(r,"project.json");try{var l=JSON.parse(ie.readFileSync(c));l.thumbnail=ae.join(r,"thumbnail.jpg"),l.content=JSON.stringify(i),ie.writeFileSync(c,JSON.stringify(l)),toastr.info("保存成功"),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject"),t&&t()})}catch(t){toastr.warning("保存失败"),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject")})}o&&A()}):function(e,t){m({method:"POST",url:"/project/"+i.projectId+"/thumbnail",data:{thumbnail:e}}).success(function(e){console.log(e),t&&t()}).error(function(e){console.log(e),toastr.warning("上传失败")})}(r,function(){m({method:"PUT",url:"/project/"+i.projectId+"/save",data:{project:i}}).success(function(r){"ok"==r?toastr.info("保存成功"):toastr.warning("保存失败"),o&&A(),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject"),t&&t()})}).error(function(t){console.log(t),toastr.warning("保存失败"),o&&A(),a.LoadCurrentOperate(n,function(){e.$emit("UpdateProject")})})})})})}function L(){var t=a.getProjectId();if(window.local);else{u.open({animation:e.animationsEnabled,templateUrl:"saveAsModal.html",controller:"NavModalSaveAsCtrl",size:"md",resolve:{}}).result.then(function(e){S(),m({method:"POST",url:"/project/"+t+"/saveAs",data:e}).success(function(e){console.log("data",e),"ok"==e&&(A(),toastr.info("另存为成功"),window.opener&&window.opener.location.reload())}).error(function(e){console.log(e),toastr.info("另存为失败"),A()})},function(e){})}}function $(t){t!=e.component.nav.currentNav?(e.component.nav.currentNav=t,e.component.tool.toolShow=!0):e.component.tool.toolShow=!e.component.tool.toolShow,e.$emit("ChangeToolShow",e.component.tool.toolShow),e.$broadcast("ChangeToolShow",e.component.tool.toolShow)}function O(){t(function(){e.component.tool.operateQueStatus=n.getOperateQueStatus(),e.component.tool.deleteStatus=n.getDeleteStatus(),e.component.tool.layerStatus=n.getLayerStatus(),e.component.tool.widgetStatus=n.getWidgetStatus(),e.component.tool.copyStatus=n.getCopyStatus(),e.component.tool.pasteStatus=n.getPasteStatus(),e.component.tool.sublayerStatus=n.getSubLayerStatus(),e.component.tool.pageStatus=n.getPageStatus()})}function M(){if(!n.getLayerStatus())return void console.warn("不在对应模式");var o=a.SaveCurrentOperate(),r=i.getDefaultLayer();a.AddNewLayerInCurrentPage(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function k(){if(n.getSubLayerStatus()){var o=a.SaveCurrentOperate(),r=i.getDefaultSubLayer();a.AddNewSubLayerInCurrentLayer(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}}function F(o){if(n.getWidgetStatus()){var r=a.SaveCurrentOperate(),c=null;if(0===o)c=i.getDefaultSlide();else if(2===o)c=i.getDefaultProgress();else if(3===o)c=i.getDefaultDashboard();else if(8===o)c=i.getDefaultButton();else if(10===o)c=i.getDefaultButtonGroup();else if(7===o)c=i.getDefaultTextArea();else if(6===o)c=i.getDefaultNum();else if(1===o)c=i.getDefaultSwitch();else if(4===o)c=i.getDefaultRotateImg();else if(5===o)c=i.getDefaultDateTime();else if(11===o)c=i.getDefaultScriptTrigger();else if(9===o)c=i.getDefaultSlideBlock();else if(12===o)c=i.getDefaultVideo();else if(13===o)c=i.getDefaultAnimation();else{if(14!==o)return;c=i.getDefaultTexNum()}c.name==e.oldWidget.name?(e.oldWidget.coordinate+=20,c.info.left=e.oldWidget.coordinate,c.info.top=e.oldWidget.coordinate):(e.oldWidget.name=c.name,e.oldWidget.coordinate=0),a.AddNewWidgetInCurrentSubLayer(c,function(){toastr.info("添加Widget成功"),t(function(){e.$emit("ChangeCurrentSubLayer",r)})},function(e){})}}function U(){n.DoUndo(function(){e.$emit("Undo")})}function E(){n.DoRedo(function(){e.$emit("Redo")})}function W(t){n.DoCopy(function(){e.$emit("DoCopy"),t&&t()})}function R(){W(function(){J()})}function B(e){a.OnSelectAll(e)}function x(){B(function(){J()})}function z(){var o=a.SaveCurrentOperate();n.DoPaste(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function J(){var o=a.SaveCurrentOperate();n.DoDelete(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function G(){c.OpenProject(function(){})}function Q(t){if("local"==t){var o={};a.getProjectCopyTo(o),o.project.resourceList=g.getAllResource(),o.project.customTags=f.getAllCustomTags(),o.project.timerTags=f.getAllTimerTags(),o.project.timers=f.getTimerNum(),o.project.version=window.ideVersion,o.project.CANId=h.getCANId();o.project;window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show()),m({method:"POST",url:"/project/"+e.project.projectId+"/generateLocalProject"}).success(function(t,o,n){window.spinner&&window.spinner.hide(),"ok"==t?(toastr.info("生成本地版成功"),window.location.href="/project/"+e.project.projectId+"/downloadLocalProject"):toastr.error("生成失败")}).error(function(e,t,o){console.log(e)})}else V(t),window?(window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show()),w.renderProject(window.projectData,function(){toastr.info("生成成功"),window.spinner&&window.spinner.hide()},function(){toastr.info("生成失败"),window.spinner&&window.spinner.hide()})):D(function(){S(),m({method:"POST",url:"/project/"+e.project.projectId+"/generate",data:{dataStructure:window.projectData}}).success(function(t,o,n){A(),"ok"==t?(toastr.info("生成成功"),window.location.href="/project/"+e.project.projectId+"/download"):(console.log(t),toastr.info("生成失败"))}).error(function(e,t,o){A(),console.log(e),toastr.info("生成失败")})})}function V(e){var t={};a.getProjectCopyTo(t),t.project=v.transDataFile(t.project),t.project.format=e,t.project.resourceList=_.cloneDeep(g.getAllResource()),t.project.basicUrl=g.getResourceUrl(),t.project.tagList=f.getAllTags(),t.project.timers=f.getTimerNum(),t.project.CANId=h.getCANId();for(var o=0;o<t.project.pageList.length;o++)j.linkPageAllWidgets(t.project.pageList[o]);window.projectData=t.project}function q(){V(),window.cachedResourceList=g.getGlobalResources(),e.component.simulator.show=!0}function Z(){e.component.simulator.show=!1}function H(){}function K(t,o){u.open({animation:e.animationsEnabled,templateUrl:"navModalCloseWindow.html",controller:"NavModalCloseWindwoCtl",size:"md",backdrop:"static",resolve:{}}).result.then(function(e){t&&t()},function(){o&&o()})}function X(){u.open({animation:e.animationsEnabled,templateUrl:"navModal.html",controller:"NavModalCtl",size:"md",resolve:{}}).result.then(function(e){Q(e.format)},function(){console.log("Modal dismissed at: "+new Date)})}function Y(){var e=!1;return"true"===document.getElementById("saveFlag").value&&(e=!0),e}function ee(){var t;if(window.local){var o=te("CAN").map(function(e){return JSON.parse(e)}),t=o.map(function(e){return{name:e.name,id:e._id}});u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}}).result.then(function(e){if(e){for(var t=null,n=0;n<o.length;n++)if(o[n]._id==e){t=JSON.parse(o[n].content);break}t?ne(e,t):toastr.error("导入失败")}else re()},function(){})}else m({method:"GET",url:"/CANProject/names"}).success(function(o,n,r){t=o,u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}}).result.then(function(e){e?ne(e):re()},function(){})}).error(function(e){console.log("err",e),toastr.warning("获取失败")})}function te(e){var t,o,n=ae.join(ce,"localproject","localCANProject");switch(e){case"CAN":t=n,o="CANProject.json";break;case"normal":default:t=localProjectDir,o="project.json"}var r=[];try{var a=ie.statSync(t);if(a&&a.isDirectory())for(var i=ie.readdirSync(t),c=0;c<i.length;c++){var l=ae.join(t,i[c]),s=oe(ae.join(l,o),!0);s&&r.push(s)}}catch(e){}return r}function oe(e,t){if(!t)return ie.readFileSync(e,"utf-8");try{var o=ie.statSync(e);return o&&o.isFile()?ie.readFileSync(e,"utf-8"):null}catch(e){return null}}function ne(t,o){if(window.local){var n=ae.join(ce,"localproject",e.project.projectId,"resources");try{if(ie.statSync(n).isDirectory()){var r=ae.join(n,"CANFile.json");ie.writeFileSync(r,JSON.stringify(o,null,4)),toastr.info("导入成功")}else toastr.error("导入失败")}catch(e){toastr.error("导入失败")}}else m({method:"POST",url:"/CANProject/"+t+"/importCANFile",data:{projectId:e.project.projectId}}).success(function(e,t,o){"ok"==e&&toastr.info("导入成功")}).error(function(e,t,o){toastr.error("导入失败"),console.log("导入失败",e)})}function re(){if(window.local){var t=ae.join(ce,"localproject",e.project.projectId,"resources");try{if(ie.statSync(t).isDirectory()){var o=ae.join(t,"CANFile.json");ie.unlink(o,function(e){e?toastr.error("取消失败"):toastr.info("取消CAN配置")})}else toastr.error("取消失败")}catch(e){toastr.error("取消失败")}}else m({method:"POST",url:"/CANProject/"+e.project.projectId+"/deleteCANFile",data:{}}).success(function(e,t,o){"ok"==e&&toastr.info("取消CAN配置")}).error(function(e,t,o){console.log("删除失败",e)})}var ae,ie,ce;!function(){window.local&&(ae=require("path"),ie=require("fs"),ce=global.__dirname)}(),function(){e.component={nav:{currentNav:-1,navs:[{name:"文件"},{name:"开始"},{name:"编辑"},{name:"格式"},{name:"视图"},{name:"帮助"}],changeNav:$},tool:{toolShow:!1,operateQueStatus:d.getOperateQueStatus(),deleteStatus:!1,sublayerStatus:!1,undo:U,redo:E,copy:W,cut:R,paste:z,selectAll:B,clearAll:x,addLayer:M,addSubLayer:k,deleteObject:J,addWidget:F,openProject:G,generateDataFile:Q,play:q,openPanel:X,openCANPanel:ee,runSimulator:H,closeSimulator:Z,saveProject:D.bind(null,null,!0),saveProjectAs:L,showLeft:N,showRight:y,showBottom:b,rotateCanvasLeft:P,rotateCanvasRight:I},simulator:{show:!1}}}(),function(){if(window.local){var e=nw.Window.get(),t=!1;e.on("close",function(o){t||(t=!0,Y()?e.close(!0):(t=!0,K(function(){D(function(){e.close(!0)}.bind(this),!0)}.bind(this),function(){e.close(!0)}.bind(this))))}.bind(this))}else window.addEventListener("beforeunload",function(e){Y()?console.log("projects have been saved"):e.returnValue="请确定已保存您的工程"})}(),e.$on("GlobalProjectReceived",function(){C(),e.$emit("LoadUp")}),e.oldWidget={name:"",coordinate:0}}]),ide.controller("NavModalCtl",["$scope","$uibModalInstance",function(e,t){e.formats=[{type:"normal",name:"默认"},{type:"dxt3",name:"压缩"}];var o={type:"local",name:"本地"};window.local||(e.formats[2]=o),e.generateFormat="normal",e.ok=function(){t.close({format:e.generateFormat})},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCloseWindwoCtl",["$scope","$uibModalInstance",function(e,t){e.ok=function(){t.close()},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCANConfig",["$scope","$uibModalInstance","data","NavModalCANConfigService",function(e,t,o,n){e.CANInfo=o,e.selectCANId=n.getCANId(),e.ok=function(){null==e.selectCANId&&null==n.getCANId()?t.dismiss("cancel"):(n.setCANId(e.selectCANId),t.close(e.selectCANId))},e.cancel=function(){t.dismiss("cancel")}}]),ide.service("NavModalCANConfigService",[function(){var e;this.setCANId=function(t){e=t},this.getCANId=function(){return e||""}}]),ide.controller("NavModalSaveAsCtrl",["$scope","$uibModalInstance",function(e,t){function o(){try{for(var e=0;e<arguments.length;e++){if(arguments[e].match(/[^\d|A-Z|a-z|\u4E00-\u9FFF| ]/))return!1}return!0}catch(e){return!1}}e.saveAsName="",e.saveAsAuthor="",e.ok=function(){if(o(e.saveAsName,e.saveAsAuthor)){var n={saveAsName:e.saveAsName,saveAsAuthor:e.saveAsAuthor};t.close(n)}else t.dismiss("cancel"),toastr.error("名称只能是汉字、英文和数字")},e.cancel=function(){t.dismiss("cancel")}}]);