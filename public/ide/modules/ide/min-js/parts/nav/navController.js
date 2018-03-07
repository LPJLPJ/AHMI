ide.controller("NavCtrl",["$scope","$timeout","GlobalService","NavService","saveProjectModal","ProjectService","TemplateProvider","ProjectFileManage","Type","CanvasService","$uibModal","OperateQueService","TagService","ResourceService","$http","ProjectTransformService","RenderSerive","LinkPageWidgetsService","NavModalCANConfigService",function(e,t,o,n,r,a,i,s,c,l,u,d,f,g,p,m,h,v,y){function w(){a.getProjectTo(e),e.$on("NavStatusChanged",D),e.$on("OpenSimulator",e.component.tool.play)}function S(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),window.spinner.show({progress:!1}))}function j(){window.spinner&&window.spinner.hide()}function b(){e.$emit("ChangeShownArea",0)}function C(){e.$emit("ChangeShownArea",1)}function M(){e.$emit("ChangeShownArea",2)}function A(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(270deg);left:0;top:0",t.style.cssText="transform:rotate(270deg);left:0;top:0",o.style.cssText="transform:rotate(270deg);left:0;top:0"}function N(){var e=document.getElementById("c"),t=document.getElementById("backgroundCanvas"),o=document.getElementById("c1");e.style.cssText="transform:rotate(0deg);left:0;top:0",t.style.cssText="transform:rotate(0deg);left:0;top:0",o.style.cssText="transform:rotate(0deg);left:0;top:0"}function I(e,t,o,n,r,a){var i=new Image;i.src=e,i.onload=function(){var e=i.width,s=i.height,c=l.getOffCanvas();c.width=o,c.height=n;var u=c.getContext("2d");if(r){if(e>s){var d=1*s/e*o,f=(n-d)/2;u.drawImage(i,0,f,o,d)}else{var g=1*e/s*n,p=(o-g)/2;u.drawImage(i,p,0,g,n)}}else u.drawImage(i,0,0,o,n);"jpeg"==t[0]?a&&a(c.toDataURL("image/jpeg",t[1]||.8)):a&&a(c.toDataURL("image/png"))},i.onerror=function(){a&&a("")}}function L(t,o,n){o&&S(),a.addSaveInfo();var r=a.SaveCurrentOperate();a.changeCurrentPageIndex(0,function(){function i(){s.project.resourceList=g.getAllResource(),s.project.customTags=f.getAllCustomTags(),s.project.timerTags=f.getAllTimerTags(),s.project.timers=f.getTimerNum(),s.project.version=window.ideVersion,s.project.CANId=y.getCANId();var n=s.project;I(_.cloneDeep(n.pages[0].url),["jpeg"],200,200,!0,function(i){_.forEach(n.pages,function(e){e.url="",_.forEach(e.layers,function(e){e.url="",e.showSubLayer.url="",_.forEach(e.subLayers,function(e){e.url=""})})}),window.local?function(t,o){var r=new Buffer(t.split(",")[1],"base64"),a=e.project.projectUrl||le.join(de,"localproject",n.projectId),i=le.join(a,"thumbnail.jpg");try{ue.writeFileSync(i,r),o&&o()}catch(e){o&&o(e)}}(i,function(){var i=g.getProjectUrl(),s=le.join(i,"project.json"),c=le.join(i,"resources"),l=n.resourceList&&n.resourceList.map(function(e){return e.id});try{var u=JSON.parse(ue.readFileSync(s));u.lastModifiedTime=(new Date).toLocaleString(),u.thumbnail=le.join(i,"thumbnail.jpg"),u.content=JSON.stringify(n),u.backups&&u.backups instanceof Array||(u.backups=[]),u.backups.length>=5&&u.backups.shift(),u.backups.push({time:new Date,content:u.content}),ue.readdir(c,function(e,t){if(e)console.log("err in read files",e);else if(t&&t.length){var o=_.difference(t,l);o.map(function(e){var t=le.join(c,e);ue.stat(t,function(e,o){o&&o.isFile()&&ue.unlink(t)})})}}),ue.writeFileSync(s,JSON.stringify(u)),toastr.info("保存成功"),a.LoadCurrentOperate(r,function(){e.$emit("UpdateProject");var o="/project/"+n.projectId+"/editor";history.pushState(null,"",o),t&&t()})}catch(t){toastr.warning("保存失败"),a.LoadCurrentOperate(r,function(){e.$emit("UpdateProject")})}o&&j()}):function(e,t){p({method:"POST",url:"/project/"+n.projectId+"/thumbnail",data:{thumbnail:e}}).success(function(e){console.log(e),t&&t()}).error(function(e){console.log(e),toastr.warning("上传失败")})}(i,function(){p({method:"PUT",url:"/project/"+n.projectId+"/save",data:{project:n}}).success(function(i){var s=!1;"ok"==i?(toastr.info("保存成功"),s=!0):toastr.warning("保存失败"),o&&j(),a.LoadCurrentOperate(r,function(){if(e.$emit("UpdateProject"),s){var o="/project/"+n.projectId+"/editor";void 0!==history.pushState?history.pushState(null,"",o):window.location.assign(o)}t&&t()})}).error(function(t){console.log(t),toastr.warning("保存失败"),o&&j(),a.LoadCurrentOperate(r,function(){e.$emit("UpdateProject")})})})})}var s={};a.getProjectCopyTo(s),n?Q(s.project,function(e){s.project=e,i()}):i()})}function T(){var t=a.getProjectId(),o=u.open({animation:e.animationsEnabled,templateUrl:"saveAsModal.html",controller:"NavModalSaveAsCtrl",size:"md",resolve:{}});window.local?o.result.then(function(e){S();var o,n=g.getProjectUrl(),r=le.join(n,"project.json"),a=""+Date.now()+Math.round(1e3*(Math.random()+1)),i=new RegExp(String(t),"g"),s=le.join(de,"localproject"),c=ie(r,!0);c=c.replace(i,a),o=JSON.parse(c),e.saveAsName?o.name=e.saveAsName:o.name=o.name+"副本",e.saveAsAuthor&&(o.author=e.saveAsAuthor),e.saveAsResolution&&(o.content=P(e.saveAsResolution,o.resolution,o.content),o.resolution=e.saveAsResolution),o.createTime=(new Date).toLocaleString(),o.lastModifiedTime=(new Date).toLocaleString();var l=le.join(s,a);fe.emptyDir(l,function(e){e&&(console.log(e),toastr.error("另存为出错")),console.log(n,l),fe.copy(n,l,function(e){e&&(console.error(e),toastr.error("另存为出错")),fe.writeFile(le.join(l,"project.json"),JSON.stringify(o),function(e){e&&(console.log(e),toastr.error("另存为出错")),j(),toastr.info("另存为成功!"),window.opener.location.reload()})})})}):o.result.then(function(e){S(),p({method:"POST",url:"/project/"+t+"/saveAs",data:e}).success(function(e){console.log("data",e),"ok"==e&&(j(),toastr.info("另存为成功"),window.opener&&window.opener.location.reload())}).error(function(e){console.log(e),toastr.info("另存为失败"),j()})},function(e){})}function P(e,t,o){var n=e.split("*")[0]/t.split("*")[0],r=e.split("*")[1]/t.split("*")[1],o=JSON.parse(o);for(var a in o.pages)if(o.pages[a].layers)for(var i in o.pages[a].layers){var s=o.pages[a].layers[i].info;if(s.width=Math.round(s.width*n),s.height=Math.round(s.height*r),s.left=Math.round(s.left*n),s.top=Math.round(s.top*r),o.pages[a].layers[i].subLayers)for(var c in o.pages[a].layers[i].subLayers)for(var l in o.pages[a].layers[i].subLayers[c].widgets){var u=o.pages[a].layers[i].subLayers[c].widgets[l].type,d=o.pages[a].layers[i].subLayers[c].widgets[l].info;d.width=Math.round(d.width*n),d.height=Math.round(d.height*r),d.left=Math.round(d.left*n),d.top=Math.round(d.top*r),"MyButton"!=u&&"MyTextArea"!=u||(d.fontSize=Math.round(d.fontSize*n)),"MyTexNum"!=u&&"MyTexTime"!=u||(d.characterW=Math.round(d.characterW*n),d.characterH=Math.round(d.characterH*r)),"MyTexTime"==u&&(d.characterW=Math.round(d.characterW*n),d.characterH=Math.round(d.characterH*r)),"MyDateTime"!=u&&"MyNum"!=u||(d.fontSize=Math.round(d.fontSize*n),d.maxFontWidth=Math.round(d.maxFontWidth*n),d.spacing=Math.round((d.spacing||0)*n)),"MyDashboard"==u&&(d.pointerLength=Math.round(d.pointerLength*n))}if(o.pages[a].layers[i].showSubLayer)for(var f in o.pages[a].layers[i].showSubLayer.widgets){var g=o.pages[a].layers[i].showSubLayer.widgets[f].type,p=o.pages[a].layers[i].showSubLayer.widgets[f].info;p.width=Math.round(p.width*n),p.height=Math.round(p.height*r),p.left=Math.round(p.left*n),p.top=Math.round(p.top*r),"MyButton"!=g&&"MyTextArea"!=g||(p.fontSize=Math.round(p.fontSize*n)),"MyTexNum"!=g&&"MyTexTime"!=u||(p.characterW=Math.round(p.characterW*n),p.characterH=Math.round(p.characterH*r)),"MyDateTime"!=g&&"MyNum"!=g||(p.fontSize=Math.round(p.fontSize*n),p.maxFontWidth=Math.round(p.maxFontWidth*n)),"MyDashboard"==g&&(p.pointerLength=Math.round(p.pointerLength*n))}if(o.pages[a].layers[i].animations)for(var m in o.pages[a].layers[i].animations){var h=o.pages[a].layers[i].animations[m].animationAttrs.translate;h.srcPos.x=Math.round(h.srcPos.x*n),h.srcPos.y=Math.round(h.srcPos.y*r),h.dstPos.x=Math.round(h.dstPos.x*n),h.dstPos.y=Math.round(h.dstPos.y*r)}}return JSON.stringify(o)}function k(t){t!=e.component.nav.currentNav?(e.component.nav.currentNav=t,e.component.tool.toolShow=!0):e.component.tool.toolShow=!e.component.tool.toolShow,e.$emit("ChangeToolShow",e.component.tool.toolShow),e.$broadcast("ChangeToolShow",e.component.tool.toolShow)}function D(){t(function(){e.component.tool.operateQueStatus=n.getOperateQueStatus(),e.component.tool.deleteStatus=n.getDeleteStatus(),e.component.tool.layerStatus=n.getLayerStatus(),e.component.tool.widgetStatus=n.getWidgetStatus(),e.component.tool.copyStatus=n.getCopyStatus(),e.component.tool.pasteStatus=n.getPasteStatus(),e.component.tool.sublayerStatus=n.getSubLayerStatus(),e.component.tool.pageStatus=n.getPageStatus()})}function O(){if(!n.getLayerStatus())return void console.warn("不在对应模式");var o=a.SaveCurrentOperate(),r=i.getDefaultLayer();a.AddNewLayerInCurrentPage(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function $(){if(n.getSubLayerStatus()){var o=a.SaveCurrentOperate(),r=i.getDefaultSubLayer();a.AddNewSubLayerInCurrentLayer(r,function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}}function x(o){if(n.getWidgetStatus()){var r=a.SaveCurrentOperate(),s=null;if(0===o)s=i.getDefaultSlide();else if(2===o)s=i.getDefaultProgress();else if(3===o)s=i.getDefaultDashboard();else if(8===o)s=i.getDefaultButton();else if(10===o)s=i.getDefaultButtonGroup();else if(7===o)s=i.getDefaultTextArea();else if(6===o)s=i.getDefaultNum();else if(1===o)s=i.getDefaultSwitch();else if(4===o)s=i.getDefaultRotateImg();else if(5===o)s=i.getDefaultDateTime();else if(11===o)s=i.getDefaultScriptTrigger();else if(9===o)s=i.getDefaultSlideBlock();else if(12===o)s=i.getDefaultVideo();else if(13===o)s=i.getDefaultAnimation();else if(14===o)s=i.getDefaultTexNum();else{if(15!==o)return;s=i.getDefaultTexTime()}s.name==e.oldWidget.name?(e.oldWidget.coordinate+=20,s.info.left=e.oldWidget.coordinate,s.info.top=e.oldWidget.coordinate):(e.oldWidget.name=s.name,e.oldWidget.coordinate=0),a.AddNewWidgetInCurrentSubLayer(s,function(){toastr.info("添加Widget成功"),t(function(){e.$emit("ChangeCurrentSubLayer",r)})},function(e){})}}function W(){n.DoUndo(function(){e.$emit("Undo")})}function R(){n.DoRedo(function(){e.$emit("Redo")})}function F(t){n.DoCopy(function(){e.$emit("DoCopy"),t&&t()})}function B(){F(function(){J()})}function E(e){a.OnSelectAll(e)}function U(){E(function(){J()})}function z(){var o=a.SaveCurrentOperate();n.DoPaste(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function J(){var o=a.SaveCurrentOperate();n.DoDelete(function(){t(function(){e.$emit("ChangeCurrentPage",o)})})}function K(){s.OpenProject(function(){})}function H(t){if("local"==t||"localCompatible"==t){var o={},n=function(){window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),S()),p({method:"POST",url:"/project/"+e.project.projectId+"/generateLocalProject"}).success(function(t,o,n){window.spinner&&window.spinner.hide(),"ok"==t?(toastr.info("生成本地版成功"),window.location.href="/project/"+e.project.projectId+"/downloadLocalProject"):toastr.error("生成失败")}).error(function(e,t,o){window.spinner&&window.spinner.hide(),toastr.error("生成失败,请尝试先保存"),console.log(e)})};a.getProjectCopyTo(o),"localCompatible"===t?L(n,!0,!0):n()}else G(t),window?(window.spinner&&(window.spinner.setBackgroundColor("rgba(0,0,0,0.5)"),S()),h.renderProject(window.projectData,function(){toastr.info("生成成功"),window.spinner&&window.spinner.hide()},function(){toastr.info("生成失败"),window.spinner&&window.spinner.hide()})):L(function(){S(),p({method:"POST",url:"/project/"+e.project.projectId+"/generate",data:{dataStructure:window.projectData}}).success(function(t,o,n){j(),"ok"==t?(toastr.info("生成成功"),window.location.href="/project/"+e.project.projectId+"/download"):(console.log(t),toastr.info("生成失败"))}).error(function(e,t,o){j(),console.log(e),toastr.info("生成失败")})})}function G(e){var t={};a.getProjectCopyTo(t),t.project=m.transDataFile(t.project),t.project.format=e,t.project.resourceList=_.cloneDeep(g.getAllResource()),t.project.basicUrl=g.getResourceUrl(),t.project.tagList=f.getAllTags(),t.project.timers=f.getTimerNum(),t.project.CANId=y.getCANId();for(var o=0;o<t.project.pageList.length;o++)v.linkPageAllWidgets(t.project.pageList[o]);window.projectData=t.project}function Q(e,t){var o=_.cloneDeep(e),n=0,r=new fabric.Canvas("tmp1"),a=new fabric.Canvas("tmp2",{renderOnAddRemove:!1});n=0;var i,s,c=o.pages.length,l=function(){i=null,i=o.pages[n],s=n,r.setWidth(o.initSize.width),r.setHeight(o.initSize.height),r.zoomToPoint(new fabric.Point(0,0),1),void 0!==i.layers&&(i.layers.forEach(function(e,t){e.subLayers.forEach(function(t,o){a.setWidth(e.w),a.setHeight(e.h),a.zoomToPoint(new fabric.Point(0,0),1),t.widgets.forEach(function(e,t){V(e,a)}),t.proJsonStr=a.toJSON(),a.clear()}),V(e,r)}),i.backgroundImage&&""!==i.backgroundImage?r.setBackgroundImage(i.backgroundImage,function(){r.setBackgroundColor(i.backgroundColor,function(){i.proJsonStr=r.toJSON(),r.clear(),n++,n<c?l():t&&t(o)})},{width:r.getWidth(),height:r.getHeight()}):r.setBackgroundImage(null,function(){r.setBackgroundColor(i.backgroundColor,function(){i.proJsonStr=r.toJSON(),r.clear(),n++,n<c?l():t&&t(o)})}))};l()}function V(e,t,o){var n={width:e.info.width,height:e.info.height,top:e.info.top,left:e.info.left,id:e.id,lockScalingFlip:!0,hasRotatingPoint:!1,shadow:{color:"rgba(0,0,0,0.4)",blur:2}},r=function(e){t.add(e)};switch(e.type){case"MySlide":fabric.MySlide.fromLevel(e,r,n);break;case"MyProgress":fabric.MyProgress.fromLevel(e,r,n);break;case"MyDashboard":fabric.MyDashboard.fromLevel(e,r,n);break;case"MyButton":fabric.MyButton.fromLevel(e,r,n);break;case"MyButtonGroup":fabric.MyButtonGroup.fromLevel(e,r,n);break;case"MyNumber":fabric.MyNumber.fromLevel(e,r,n);break;case"MyTextArea":fabric.MyTextArea.fromLevel(e,r,n);break;case"MyKnob":fabric.MyKnob.fromLevel(e,r,n);break;case"MyOscilloscope":fabric.MyOscilloscope.fromLevel(e,r,n);break;case"MySwitch":fabric.MySwitch.fromLevel(e,r,n);break;case"MyRotateImg":fabric.MyRotateImg.fromLevel(e,r,n);break;case"MyDateTime":fabric.MyDateTime.fromLevel(e,r,n);break;case"MyScriptTrigger":fabric.MyScriptTrigger.fromLevel(e,r,n);break;case"MyVideo":fabric.MyVideo.fromLevel(e,r,n);break;case"MyAnimation":fabric.MyAnimation.fromLevel(e,r,n);break;case"MyLayer":t.add(new fabric.MyLayer(e,n));break;case"MyNum":t.add(new fabric.MyNum(e,n));break;case"MyTexNum":t.add(new fabric.MyTexNum(e,n));break;default:console.error("not match widget in preprocess!")}}function q(){G(),window.cachedResourceList=g.getGlobalResources(),e.component.simulator.show=!0}function Z(){e.component.simulator.show=!1}function X(){}function Y(t,o){u.open({animation:e.animationsEnabled,templateUrl:"navModalCloseWindow.html",controller:"NavModalCloseWindwoCtl",size:"md",backdrop:"static",resolve:{}}).result.then(function(e){t&&t()},function(){o&&o()})}function ee(){u.open({animation:e.animationsEnabled,templateUrl:"navModal.html",controller:"NavModalCtl",size:"md",resolve:{}}).result.then(function(e){H(e.format)},function(){console.log("Modal dismissed at: "+new Date)})}function te(){var e=!1;return"true"===document.getElementById("saveFlag").value&&(e=!0),e}function oe(){u.open({animation:e.animationsEnabled,templateUrl:"shareModal.html",controller:"shareModalCtl",scope:e,size:"md",resolve:{id:function(){return e.project.projectId}}}).result.then(function(e){H(e.format)},function(){})}function ne(){var t;if(window.local){var o=ae("CAN").map(function(e){return JSON.parse(e)}),t=o.map(function(e){return{name:e.name,id:e._id}});u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}}).result.then(function(e){if(e){for(var t=null,n=0;n<o.length;n++)if(o[n]._id==e){t=JSON.parse(o[n].content);break}t?se(e,t):toastr.error("导入失败")}else ce()},function(){})}else p({method:"GET",url:"/CANProject/names"}).success(function(o,n,r){t=o,u.open({animation:e.animationsEnabled,templateUrl:"navCANModal.html",controller:"NavModalCANConfig",size:"md",resolve:{data:function(){return t}}}).result.then(function(e){e?se(e):ce()},function(){})}).error(function(e){console.log("err",e),toastr.warning("获取失败")})}function re(){u.open({animation:!0,templateUrl:"tagsImport.html",scope:e,size:"md",controller:["$scope","$uibModalInstance","$http",function(e,t,o){function n(e){var t=new RegExp(/tags_default\d+$/g),n="";t.test(e)&&(n="/public/ide/modules/tagConfig/template/"+e.replace("_",".")+".json"),o({method:"get",url:n}).success(function(e){r(null,e)}).error(function(e){r(e,null)})}function r(t,o){if(t)return console.error("err in get tags template"),void toastr.error("获取失败，请检查您的网络");console.log("data",o),e.$emit("GetTagsFromRemote",o)}e.selectedTagId=null,e.ok=function(){if(!e.selectedTagId)return void toastr.warning("请选择一项预设变量");n(e.selectedTagId),t.close()},e.cancel=function(){t.dismiss()}}]})}function ae(e){var t,o,n=le.join(de,"localproject","localCANProject");switch(e){case"CAN":t=n,o="CANProject.json";break;case"normal":default:t=localProjectDir,o="project.json"}var r=[];try{var a=ue.statSync(t);if(a&&a.isDirectory())for(var i=ue.readdirSync(t),s=0;s<i.length;s++){var c=le.join(t,i[s]),l=ie(le.join(c,o),!0);l&&r.push(l)}}catch(e){}return r}function ie(e,t){if(!t)return ue.readFileSync(e,"utf-8");try{var o=ue.statSync(e);return o&&o.isFile()?ue.readFileSync(e,"utf-8"):null}catch(e){return null}}function se(t,o){if(window.local){var n=le.join(de,"localproject",e.project.projectId,"resources");try{if(ue.statSync(n).isDirectory()){var r=le.join(n,"CANFile.json");ue.writeFileSync(r,JSON.stringify(o,null,4)),toastr.info("导入成功")}else toastr.error("导入失败")}catch(e){toastr.error("导入失败")}}else p({method:"POST",url:"/CANProject/"+t+"/importCANFile",data:{projectId:e.project.projectId}}).success(function(e,t,o){"ok"==e&&toastr.info("导入成功")}).error(function(e,t,o){toastr.error("导入失败"),console.log("导入失败",e)})}function ce(){if(window.local){var t=le.join(de,"localproject",e.project.projectId,"resources");try{if(ue.statSync(t).isDirectory()){var o=le.join(t,"CANFile.json");ue.unlink(o,function(e){e?toastr.error("取消失败"):toastr.info("取消CAN配置")})}else toastr.error("取消失败")}catch(e){toastr.error("取消失败")}}else p({method:"POST",url:"/CANProject/"+e.project.projectId+"/deleteCANFile",data:{}}).success(function(e,t,o){"ok"==e&&toastr.info("取消CAN配置")}).error(function(e,t,o){console.log("删除失败",e)})}var le,ue,de,fe;!function(){window.local&&(le=require("path"),ue=require("fs"),fe=require("fs-extra"),de=global.__dirname)}(),function(){e.component={nav:{currentNav:-1,navs:[{name:"文件"},{name:"开始"},{name:"编辑"},{name:"格式"},{name:"视图"},{name:"帮助"}],changeNav:k},tool:{toolShow:!1,operateQueStatus:d.getOperateQueStatus(),deleteStatus:!1,sublayerStatus:!1,undo:W,redo:R,copy:F,cut:B,paste:z,selectAll:E,clearAll:U,addLayer:O,addSubLayer:$,deleteObject:J,addWidget:x,openProject:K,generateDataFile:H,play:q,openPanel:ee,openShare:oe,openCANPanel:ne,openTagsPanel:re,runSimulator:X,closeSimulator:Z,saveProject:L.bind(null,null,!0),saveProjectAs:T,showLeft:b,showRight:C,showBottom:M,rotateCanvasLeft:A,rotateCanvasRight:N},simulator:{show:!1}}}(),function(){if(window.local){var e=nw.Window.get(),t=!1;e.on("close",function(o){t||(t=!0,te()?e.close(!0):(t=!0,Y(function(){L(function(){e.close(!0)}.bind(this),!0)}.bind(this),function(){e.close(!0)}.bind(this))))}.bind(this))}else window.addEventListener("beforeunload",function(e){te()?console.log("projects have been saved"):e.returnValue="请确定已保存您的工程"})}(),e.$on("GlobalProjectReceived",function(){w(),e.$emit("LoadUp")}),e.oldWidget={name:"",coordinate:0}}]),ide.controller("NavModalCtl",["$scope","$uibModalInstance",function(e,t){e.formats=[{type:"normal",name:"默认"},{type:"dxt3",name:"压缩"}];var o={type:"local",name:"本地"},n={type:"localCompatible",name:"本地(兼容)"};window.local||(e.formats[2]=o,e.formats[3]=n),e.generateFormat="normal",e.ok=function(){t.close({format:e.generateFormat})},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("shareModalCtl",["$rootScope","$scope","$uibModalInstance","$http","id",function(e,t,o,n,r){console.log("load",t),t.loading=!0,t.processing=!1,t.message="加载中...",console.log(window.location),t.sharedUrl=window.location.href,t.shareInfo={shared:!1,sharedKey:"",readOnlySharedKey:"",own:!1},function(){n({method:"GET",url:"/project/"+r+"/share"}).success(function(e,o,n){t.shareInfo.shared=e.shared,t.shareInfo.sharedKey=e.sharedKey,t.shareInfo.readOnlySharedKey=e.readOnlySharedKey,t.shareInfo.own=e.own,t.loading=!1,t.message=""}).error(function(e){console.log(e),t.loading=!1,t.message="加载出错..."})}(),t.toggleShare=function(){t.processing=!0,n({method:"POST",url:"/project/"+r+"/share",data:{share:!t.shareInfo.shared}}).success(function(e,o,n){t.shareInfo.shared=e.shared,t.shareInfo.sharedKey=e.sharedKey,t.shareInfo.readOnlySharedKey=e.readOnlySharedKey,t.processing=!1,t.message="",e.shared?t.$emit("createSocketIO"):t.$emit("closeSocketIO")}).error(function(e){console.log(e),t.processing=!1,t.message="更新出错..."})},t.cancel=function(){o.dismiss(t.shareInfo.shared)}}]),ide.controller("NavModalCloseWindwoCtl",["$scope","$uibModalInstance",function(e,t){e.ok=function(){t.close()},e.cancel=function(){t.dismiss("cancel")}}]),ide.controller("NavModalCANConfig",["$scope","$uibModalInstance","data","NavModalCANConfigService",function(e,t,o,n){e.CANInfo=o,e.selectCANId=n.getCANId(),e.ok=function(){null==e.selectCANId&&null==n.getCANId()?t.dismiss("cancel"):(n.setCANId(e.selectCANId),t.close(e.selectCANId))},e.cancel=function(){t.dismiss("cancel")}}]),ide.service("NavModalCANConfigService",[function(){var e;this.setCANId=function(t){e=t},this.getCANId=function(){return e||""}}]),ide.controller("NavModalSaveAsCtrl",["$scope","$uibModalInstance",function(e,t){function o(){try{for(var e=0;e<arguments.length;e++){if(arguments[e].match(/[^\d|A-Z|a-z|\u4E00-\u9FFF| ]/))return!1}return!0}catch(e){return!1}}function n(){var t="";if("custom"==e.selectCustomResolution){if(!e.saveAsWidth||!e.saveAsHeight)return!1;t=e.saveAsWidth+"*"+e.saveAsHeight}else t=e.selectCustomResolution;return t}e.saveAsName="",e.saveAsAuthor="",e.saveAsResolution="",e.selectCustomResolution="1280*480",e.ok=function(){var r="";if(!o(e.saveAsName,e.saveAsAuthor))return void toastr.error("名称只能是汉字、英文和数字");if(e.isScale){if(!n())return void toastr.error("分辨率范围有误");if(1!=confirm("请尽量保持与原尺寸等比例缩放，否则会导致控件变形"))return;e.selectCustomResolution=n(),r={saveAsName:e.saveAsName,saveAsAuthor:e.saveAsAuthor,saveAsResolution:e.selectCustomResolution}}else r={saveAsName:e.saveAsName,saveAsAuthor:e.saveAsAuthor};t.close(r)},e.cancel=function(){t.dismiss("cancel")}}]);