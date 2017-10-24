ide.controller("NavCtrl",["$scope","$timeout","GlobalService","NavService","saveProjectModal","ProjectService","TemplateProvider","ProjectFileManage","Type","CanvasService","$uibModal","OperateQueService","TagService","ResourceService","TimerService","$http","ProjectTransformService","RenderSerive","LinkPageWidgetsService","NavModalCANConfigService",function(e,o,t,n,r,a,i,c,s,l,u,d,f,g,p,m,h,w,v,j){function S(){a.getProjectTo(e),e.$on("NavStatusChanged",T),e.$on("OpenSimulator",e.component.tool.play)}function y(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show())}function b(){window.spinner&&window.spinner.hide()}function C(){e.$emit("ChangeShownArea",0)}function N(){e.$emit("ChangeShownArea",1)}function A(){e.$emit("ChangeShownArea",2)}function M(){var e=document.getElementById("c"),o=document.getElementById("backgroundCanvas"),t=document.getElementById("c1");e.style.cssText="transform:rotate(270deg);left:0;top:0",o.style.cssText="transform:rotate(270deg);left:0;top:0",t.style.cssText="transform:rotate(270deg);left:0;top:0"}function I(){var e=document.getElementById("c"),o=document.getElementById("backgroundCanvas"),t=document.getElementById("c1");e.style.cssText="transform:rotate(0deg);left:0;top:0",o.style.cssText="transform:rotate(0deg);left:0;top:0",t.style.cssText="transform:rotate(0deg);left:0;top:0"}function P(e,o,t,n,r,a){var i=new Image;i.src=e,i.onload=function(){var e=i.width,c=i.height,s=l.getOffCanvas();s.width=t,s.height=n;var u=s.getContext("2d");if(r){if(e>c){var d=1*c/e*t,f=(n-d)/2;u.drawImage(i,0,f,t,d)}else{var g=1*e/c*n,p=(t-g)/2;u.drawImage(i,p,0,g,n)}}else u.drawImage(i,0,0,t,n);"jpeg"==o[0]?a&&a(s.toDataURL("image/jpeg",o[1]||.8)):a&&a(s.toDataURL("image/png"))},i.onerror=function(){a&&a("")}}function k(o,t,n){t&&y(),a.addSaveInfo();var r=a.SaveCurrentOperate();a.changeCurrentPageIndex(0,function(){function i(){c.project.resourceList=g.getAllResource(),c.project.customTags=f.getAllCustomTags(),c.project.timerTags=f.getAllTimerTags(),c.project.timers=f.getTimerNum(),c.project.version=window.ideVersion,c.project.CANId=j.getCANId();var n=c.project;P(_.cloneDeep(n.pages[0].url),["jpeg"],200,200,!0,function(i){_.forEach(n.pages,function(e){e.url="",_.forEach(e.layers,function(e){e.url="",e.showSubLayer.url="",_.forEach(e.subLayers,function(e){e.url=""})})}),window.local?function(o,t){var r=new Buffer(o.split(",")[1],"base64"),a=e.project.projectUrl||se.join(ue,"localproject",n.projectId),i=se.join(a,"thumbnail.jpg");try{le.writeFileSync(i,r),t&&t()}catch(e){t&&t(e)}}(i,function(){var i=g.getProjectUrl(),c=se.join(i,"project.json"),s=se.join(i,"resources"),l=n.resourceList&&n.resourceList.map(function(e){return e.id});try{var u=JSON.parse(le.readFileSync(c));u.lastModifiedTime=(new Date).toLocaleString(),u.thumbnail=se.join(i,"thumbnail.jpg"),u.content=JSON.stringify(n),u.backups&&u.backups instanceof Array||(u.backups=[]),u.backups.length>=5&&u.backups.shift(),u.backups.push({time:new Date,content:u.content}),le.readdir(s,function(e,o){if(e)console.log("err in read files",e);else if(o&&o.length){var t=_.difference(o,l);t.map(function(e){var o=se.join(s,e);le.stat(o,function(e,t){t&&t.isFile()&&le.unlink(o)})})}}),le.writeFileSync(c,JSON.stringify(u)),toastr.info("保存成功"),a.LoadCurrentOperate(r,function(){e.$emit("UpdateProject");var t="/project/"+n.projectId+"/editor";history.pushState(null,"",t),o&&o()})}catch(o){toastr.warning("保存失败"),a.LoadCurrentOperate(r,function(){e.$emit("UpdateProject")})}t&&b()}):function(e,o){m({method:"POST",url:"/project/"+n.projectId+"/thumbnail",data:{thumbnail:e}}).success(function(e){console.log(e),o&&o()}).error(function(e){console.log(e),toastr.warning("上传失败")})}(i,function(){m({method:"PUT",url:"/project/"+n.projectId+"/save",data:{project:n}}).success(function(i){var c=!1;"ok"==i?(toastr.info("保存成功"),c=!0):toastr.warning("保存失败"),t&&b(),a.LoadCurrentOperate(r,function(){if(e.$emit("UpdateProject"),c){var t="/project/"+n.projectId+"/editor";void 0!==history.pushState?history.pushState(null,"",t):window.location.assign(t)}o&&o()})}).error(function(o){console.log(o),toastr.warning("保存失败"),t&&b(),a.LoadCurrentOperate(r,function(){e.$emit("UpdateProject")})})})})}var c={};a.getProjectCopyTo(c),n?V(c.project,function(e){c.project=e,i()}):i()})}function L(){var o=a.getProjectId(),t=u.open({animation:e.animationsEnabled,templateUrl:"saveAsModal.html",controller:"NavModalSaveAsCtrl",size:"md",resolve:{}});window.local?t.result.then(function(e){y();var t,n=g.getProjectUrl(),r=se.join(n,"project.json"),a=""+Date.now()+Math.round(1e3*(Math.random()+1)),i=new RegExp(String(o),"g"),c=se.join(ue,"localproject"),s=ae(r,!0);s=s.replace(i,a),t=JSON.parse(s),e.saveAsName?t.name=e.saveAsName:t.name=t.name+"副本",e.saveAsAuthor&&(t.author=e.saveAsAuthor),t.createTime=(new Date).toLocaleString(),t.lastModifiedTime=(new Date).toLocaleString();var l=se.join(c,a);de.emptyDir(l,function(e){e&&(console.log(e),toastr.error("另存为出错")),console.log(n,l),de.copy(n,l,function(e){e&&(console.error(e),toastr.error("另存为出错")),de.writeFile(se.join(l,"project.json"),JSON.stringify(t),function(e){e&&(console.log(e),toastr.error("另存为出错")),b(),toastr.info("另存为成功!"),window.opener.location.reload()})})})}):t.result.then(function(e){y(),m({method:"POST",url:"/project/"+o+"/saveAs",data:e}).success(function(e){console.log("data",e),"ok"==e&&(b(),toastr.info("另存为成功"),window.opener&&window.opener.location.reload())}).error(function(e){console.log(e),toastr.info("另存为失败"),b()})},function(e){})}function D(o){o!=e.component.nav.currentNav?(e.component.nav.currentNav=o,e.component.tool.toolShow=!0):e.component.tool.toolShow=!e.component.tool.toolShow,e.$emit("ChangeToolShow",e.component.tool.toolShow),e.$broadcast("ChangeToolShow",e.component.tool.toolShow)}function T(){o(function(){e.component.tool.operateQueStatus=n.getOperateQueStatus(),e.component.tool.deleteStatus=n.getDeleteStatus(),e.component.tool.layerStatus=n.getLayerStatus(),e.component.tool.widgetStatus=n.getWidgetStatus(),e.component.tool.copyStatus=n.getCopyStatus(),e.component.tool.pasteStatus=n.getPasteStatus(),e.component.tool.sublayerStatus=n.getSubLayerStatus(),e.component.tool.pageStatus=n.getPageStatus()})}function O(){if(!n.getLayerStatus())return void console.warn("不在对应模式");var t=a.SaveCurrentOperate(),r=i.getDefaultLayer();a.AddNewLayerInCurrentPage(r,function(){o(function(){e.$emit("ChangeCurrentPage",t)})})}function $(){if(n.getSubLayerStatus()){var t=a.SaveCurrentOperate(),r=i.getDefaultSubLayer();a.AddNewSubLayerInCurrentLayer(r,function(){o(function(){e.$emit("ChangeCurrentPage",t)})})}}function E(t){if(n.getWidgetStatus()){var r=a.SaveCurrentOperate(),c=null;if(0===t)c=i.getDefaultSlide();else if(2===t)c=i.getDefaultProgress();else if(3===t)c=i.getDefaultDashboard();else if(8===t)c=i.getDefaultButton();else if(10===t)c=i.getDefaultButtonGroup();else if(7===t)c=i.getDefaultTextArea();else if(6===t)c=i.getDefaultNum();else if(1===t)c=i.getDefaultSwitch();else if(4===t)c=i.getDefaultRotateImg();else if(5===t)c=i.getDefaultDateTime();else if(11===t)c=i.getDefaultScriptTrigger();else if(9===t)c=i.getDefaultSlideBlock();else if(12===t)c=i.getDefaultVideo();else if(13===t)c=i.getDefaultAnimation();else{if(14!==t)return;c=i.getDefaultTexNum()}c.name==e.oldWidget.name?(e.oldWidget.coordinate+=20,c.info.left=e.oldWidget.coordinate,c.info.top=e.oldWidget.coordinate):(e.oldWidget.name=c.name,e.oldWidget.coordinate=0),a.AddNewWidgetInCurrentSubLayer(c,function(){toastr.info("添加Widget成功"),o(function(){e.$emit("ChangeCurrentSubLayer",r)})},function(e){})}}function B(){n.DoUndo(function(){e.$emit("Undo")})}function F(){n.DoRedo(function(){e.$emit("Redo")})}function U(o){n.DoCopy(function(){e.$emit("DoCopy"),o&&o()})}function W(){U(function(){z()})}function R(e){a.OnSelectAll(e)}function x(){R(function(){z()})}function J(){var t=a.SaveCurrentOperate();n.DoPaste(function(){o(function(){e.$emit("ChangeCurrentPage",t)})})}function z(){var t=a.SaveCurrentOperate();n.DoDelete(function(){o(function(){e.$emit("ChangeCurrentPage",t)})})}function G(){c.OpenProject(function(){})}function K(o){if("local"==o||"localCompatible"==o){var t={},n=function(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show()),m({method:"POST",url:"/project/"+e.project.projectId+"/generateLocalProject"}).success(function(o,t,n){window.spinner&&window.spinner.hide(),"ok"==o?(toastr.info("生成本地版成功"),window.location.href="/project/"+e.project.projectId+"/downloadLocalProject"):toastr.error("生成失败")}).error(function(e,o,t){window.spinner&&window.spinner.hide(),toastr.error("生成失败,请尝试先保存"),console.log(e)})};a.getProjectCopyTo(t),"localCompatible"===o?k(n,!0,!0):n()}else Q(o),window?(window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show()),w.renderProject(window.projectData,function(){toastr.info("生成成功"),window.spinner&&window.spinner.hide()},function(){toastr.info("生成失败"),window.spinner&&window.spinner.hide()})):k(function(){y(),m({method:"POST",url:"/project/"+e.project.projectId+"/generate",data:{dataStructure:window.projectData}}).success(function(o,t,n){b(),"ok"==o?(toastr.info("生成成功"),window.location.href="/project/"+e.project.projectId+"/download"):(console.log(o),toastr.info("生成失败"))}).error(function(e,o,t){b(),console.log(e),toastr.info("生成失败")})})}function Q(e){var o={};a.getProjectCopyTo(o),o.project=h.transDataFile(o.project),o.project.format=e,o.project.resourceList=_.cloneDeep(g.getAllResource()),o.project.basicUrl=g.getResourceUrl(),o.project.tagList=f.getAllTags(),o.project.timers=f.getTimerNum(),o.project.CANId=j.getCANId();for(var t=0;t<o.project.pageList.length;t++)v.linkPageAllWidgets(o.project.pageList[t]);window.projectData=o.project}function V(e,o){var t=_.cloneDeep(e),n=0,r=new fabric.Canvas("tmp1"),a=new fabric.Canvas("tmp2",{renderOnAddRemove:!1});n=0;var i,c,s=t.pages.length,l=function(){i=null,i=t.pages[n],c=n,r.setWidth(t.initSize.width),r.setHeight(t.initSize.height),r.zoomToPoint(new fabric.Point(0,0),1),void 0!==i.layers&&(i.layers.forEach(function(e,o){e.subLayers.forEach(function(o,t){a.setWidth(e.w),a.setHeight(e.h),a.zoomToPoint(new fabric.Point(0,0),1),o.widgets.forEach(function(e,o){q(e,a)}),o.proJsonStr=a.toJSON(),a.clear()}),q(e,r)}),i.backgroundImage&&""!==i.backgroundImage?r.setBackgroundImage(i.backgroundImage,function(){r.setBackgroundColor(i.backgroundColor,function(){i.proJsonStr=r.toJSON(),r.clear(),n++,n<s?l():o&&o(t)})},{width:r.getWidth(),height:r.getHeight()}):r.setBackgroundImage(null,function(){r.setBackgroundColor(i.backgroundColor,function(){i.proJsonStr=r.toJSON(),r.clear(),n++,n<s?l():o&&o(t)})}))};l()}function q(e,o,t){var n={width:e.info.width,height:e.info.height,top:e.info.top,left:e.info.left,id:e.id,lockScalingFlip:!0,hasRotatingPoint:!1,shadow:{color:"rgba(0,0,0,0.4)",blur:2}},r=function(e){o.add(e)};switch(e.type){case"MySlide":fabric.MySlide.fromLevel(e,r,n);break;case"MyProgress":fabric.MyProgress.fromLevel(e,r,n);break;case"MyDashboard":fabric.MyDashboard.fromLevel(e,r,n);break;case"MyButton":fabric.MyButton.fromLevel(e,r,n);break;case"MyButtonGroup":fabric.MyButtonGroup.fromLevel(e,r,n);break;case"MyNumber":fabric.MyNumber.fromLevel(e,r,n);break;case"MyTextArea":fabric.MyTextArea.fromLevel(e,r,n);break;case"MyKnob":fabric.MyKnob.fromLevel(e,r,n);break;case"MyOscilloscope":fabric.MyOscilloscope.fromLevel(e,r,n);break;case"MySwitch":fabric.MySwitch.fromLevel(e,r,n);break;case"MyRotateImg":fabric.MyRotateImg.fromLevel(e,r,n);break;case"MyDateTime":fabric.MyDateTime.fromLevel(e,r,n);break;case"MyScriptTrigger":fabric.MyScriptTrigger.fromLevel(e,r,n);break;case"MyVideo":fabric.MyVideo.fromLevel(e,r,n);break;case"MyAnimation":fabric.MyAnimation.fromLevel(e,r,n);break;case"MyLayer":o.add(new fabric.MyLayer(e,n));break;case"MyNum":o.add(new fabric.MyNum(e,n));break;case"MyTexNum":o.add(new fabric.MyTexNum(e,n));break;default:console.error("not match widget in preprocess!")}}function H(){Q(),window.cachedResourceList=g.getGlobalResources(),e.component.simulator.show=!0}function Z(){e.component.simulator.show=!1}function X(){}function Y(o,t){u.open({animation:e.animationsEnabled,templateUrl:"navModalCloseWindow.html",controller:"NavModalCloseWindwoCtl",size:"md",backdrop:"static",resolve:{}}).result.then(function(e){o&&o()},function(){t&&t()})}function ee(){u.open({animation:e.animationsEnabled,templateUrl:"navModal.html",controller:"NavModalCtl",size:"md",resolve:{}}).result.then(function(e){K(e.format)},function(){console.log("Modal dismissed at: "+new Date)})}function oe(){var e=!1;return"true"===document.getElementById("saveFlag").value&&(e=!0),e}function te(){console.log("share"),u.open({animation:e.animationsEnabled,templateUrl:"shareModal.html",controller:"shareModalCtl",size:"md",resolve:{id:function(){return e.project.projectId}}}).result.then(function(e){K(e.format)},function(){console.log("Modal dismissed at: "+new Date)})}function ne(){var o;if(window.local){var t=re("CAN").map(function(e){return JSON.parse(e)}),o=t.map(function(e){return{name:e.name,id:e._id}});u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return o}}}).result.then(function(e){if(e){for(var o=null,n=0;n<t.length;n++)if(t[n]._id==e){o=JSON.parse(t[n].content);break}o?ie(e,o):toastr.error("导入失败")}else ce()},function(){})}else m({method:"GET",url:"/CANProject/names"}).success(function(t,n,r){o=t,u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return o}}}).result.then(function(e){e?ie(e):ce()},function(){})}).error(function(e){console.log("err",e),toastr.warning("获取失败")})}function re(e){var o,t,n=se.join(ue,"localproject","localCANProject");switch(e){case"CAN":o=n,t="CANProject.json";break;case"normal":default:o=localProjectDir,t="project.json"}var r=[];try{var a=le.statSync(o);if(a&&a.isDirectory())for(var i=le.readdirSync(o),c=0;c<i.length;c++){var s=se.join(o,i[c]),l=ae(se.join(s,t),!0);l&&r.push(l)}}catch(e){}return r}function ae(e,o){if(!o)return le.readFileSync(e,"utf-8");try{var t=le.statSync(e);return t&&t.isFile()?le.readFileSync(e,"utf-8"):null}catch(e){return null}}function ie(o,t){if(window.local){var n=se.join(ue,"localproject",e.project.projectId,"resources");try{if(le.statSync(n).isDirectory()){var r=se.join(n,"CANFile.json");le.writeFileSync(r,JSON.stringify(t,null,4)),toastr.info("导入成功")}else toastr.error("导入失败")}catch(e){toastr.error("导入失败")}}else m({method:"POST",url:"/CANProject/"+o+"/importCANFile",data:{projectId:e.project.projectId}}).success(function(e,o,t){"ok"==e&&toastr.info("导入成功")}).error(function(e,o,t){toastr.error("导入失败"),console.log("导入失败",e)})}function ce(){if(window.local){var o=se.join(ue,"localproject",e.project.projectId,"resources");try{if(le.statSync(o).isDirectory()){var t=se.join(o,"CANFile.json");le.unlink(t,function(e){e?toastr.error("取消失败"):toastr.info("取消CAN配置")})}else toastr.error("取消失败")}catch(e){toastr.error("取消失败")}}else m({method:"POST",url:"/CANProject/"+e.project.projectId+"/deleteCANFile",data:{}}).success(function(e,o,t){"ok"==e&&toastr.info("取消CAN配置")}).error(function(e,o,t){console.log("删除失败",e)})}var se,le,ue,de;!function(){window.local&&(se=require("path"),le=require("fs"),de=require("fs-extra"),ue=global.__dirname)}(),function(){e.component={nav:{currentNav:-1,navs:[{name:"文件"},{name:"开始"},{name:"编辑"},{name:"格式"},{name:"视图"},{name:"帮助"}],changeNav:D},tool:{toolShow:!1,operateQueStatus:d.getOperateQueStatus(),deleteStatus:!1,sublayerStatus:!1,undo:B,redo:F,copy:U,cut:W,paste:J,selectAll:R,clearAll:x,addLayer:O,addSubLayer:$,deleteObject:z,addWidget:E,openProject:G,generateDataFile:K,play:H,openPanel:ee,openShare:te,openCANPanel:ne,runSimulator:X,closeSimulator:Z,saveProject:k.bind(null,null,!0),saveProjectAs:L,showLeft:C,showRight:N,showBottom:A,rotateCanvasLeft:M,rotateCanvasRight:I},simulator:{show:!1}}}(),function(){if(window.local){var e=nw.Window.get(),o=!1;e.on("close",function(t){o||(o=!0,oe()?e.close(!0):(o=!0,Y(function(){k(function(){e.close(!0)}.bind(this),!0)}.bind(this),function(){e.close(!0)}.bind(this))))}.bind(this))}else window.addEventListener("beforeunload",function(e){oe()?console.log("projects have been saved"):e.returnValue="请确定已保存您的工程"})}(),e.$on("GlobalProjectReceived",function(){S(),e.$emit("LoadUp")}),e.oldWidget={name:"",coordinate:0}}]),ide.controller("NavModalCtl",["$scope","$uibModalInstance",function(e,o){e.formats=[{type:"normal",name:"默认"},{type:"dxt3",name:"压缩"}];var t={type:"local",name:"本地"},n={type:"localCompatible",name:"本地(兼容)"};window.local||(e.formats[2]=t,e.formats[3]=n),e.generateFormat="normal",e.ok=function(){o.close({format:e.generateFormat})},e.cancel=function(){o.dismiss("cancel")}}]),ide.controller("shareModalCtl",["$rootScope","$scope","$uibModalInstance","$http","id",function(e,o,t,n,r){console.log("load"),o.loading=!0,o.processing=!1,o.message="加载中...",console.log(window.location),o.sharedUrl=window.location.href,o.shareInfo={shared:!1,sharedKey:"",own:!1},function(){n({method:"GET",url:"/project/"+r+"/share"}).success(function(e,t,n){o.shareInfo.shared=e.shared,o.shareInfo.sharedKey=e.sharedKey,o.shareInfo.own=e.own,o.loading=!1,o.message=""}).error(function(e){console.log(e),o.loading=!1,o.message="加载出错..."})}(),o.toggleShare=function(){o.processing=!0,n({method:"POST",url:"/project/"+r+"/share",data:{share:!o.shareInfo.shared}}).success(function(e,t,n){o.shareInfo.shared=e.shared,o.shareInfo.sharedKey=e.sharedKey,o.processing=!1,o.message=""}).error(function(e){console.log(e),o.processing=!1,o.message="更新出错..."})},o.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCloseWindwoCtl",["$scope","$uibModalInstance",function(e,o){e.ok=function(){o.close()},e.cancel=function(){o.dismiss("cancel")}}]),ide.controller("NavModalCANConfig",["$scope","$uibModalInstance","data","NavModalCANConfigService",function(e,o,t,n){e.CANInfo=t,e.selectCANId=n.getCANId(),e.ok=function(){null==e.selectCANId&&null==n.getCANId()?o.dismiss("cancel"):(n.setCANId(e.selectCANId),o.close(e.selectCANId))},e.cancel=function(){o.dismiss("cancel")}}]),ide.service("NavModalCANConfigService",[function(){var e;this.setCANId=function(o){e=o},this.getCANId=function(){return e||""}}]),ide.controller("NavModalSaveAsCtrl",["$scope","$uibModalInstance",function(e,o){function t(){try{for(var e=0;e<arguments.length;e++){if(arguments[e].match(/[^\d|A-Z|a-z|\u4E00-\u9FFF| ]/))return!1}return!0}catch(e){return!1}}e.saveAsName="",e.saveAsAuthor="",e.ok=function(){if(t(e.saveAsName,e.saveAsAuthor)){var n={saveAsName:e.saveAsName,saveAsAuthor:e.saveAsAuthor};o.close(n)}else o.dismiss("cancel"),toastr.error("名称只能是汉字、英文和数字")},e.cancel=function(){o.dismiss("cancel")}}]);