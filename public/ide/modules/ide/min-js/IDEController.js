var ide=angular.module("ide",["ui.bootstrap.contextMenu","colorpicker.module","btford.modal","ui.bootstrap","ngAnimate","GlobalModule","ui.tree","IDEServices"]);ide.config(["$compileProvider",function(e){e.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/),e.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension|chrome-extension):/)}]);var baseUrl="",PID="",TOKEN="",MAX_DATA_LENGTH=1e5,ideScope,isOffline,mode="DEBUG";console.log=function(e){return"DEBUG"===mode?e.log:(e.oldLog=e.log,function(){})}(console);var logs=[];ide.controller("IDECtrl",["$scope","$timeout","$http","$interval","ProjectService","GlobalService","Preference","ResourceService","TagService","TemplateProvider","TimerService","UserTypeService","WidgetService","NavModalCANConfigService",function(e,o,t,a,n,r,c,i,s,l,u,d,f,g){function b(){var t=window.location.href,a=t.split("?")[1].split("=")[1];"#"===a[a.length-1]&&(a=a.slice(0,-1)),console.log(a);var n=k.join(G,"localproject",a);i.setProjectUrl(n);var r=k.join(n,"resources");i.setResourceUrl(r);var c=k.join(G,k.dirname(window.location.pathname));i.setResourceNWUrl(k.relative(c,r)),console.log(k.relative(c,r));var s=m(k.join(n,"project.json"));o(function(){s?(s=JSON.parse(s),p(s,a)):v({},a)},0),e.$on("LoadUp",function(){6==++I&&w()})}function m(e,o){if(!o)return M.readFileSync(e,"utf-8");try{var t=M.statSync(e);return t&&t.isFile()?M.readFileSync(e,"utf-8"):null}catch(e){return null}}function h(e,o){var a=e.template;if(l.setTemplateId(a),a&&""!==a)t({method:"GET",url:"/public/templates/defaultTemplate/defaultTemplate.json"}).success(function(t){j(t,function(){var t;t="string"==typeof e?JSON.parse(e):e,void 0!==t.format?L(e,function(e){p(e,o)}):p(e,o)}.bind(this))}).error(function(e){console.log("get json failed")});else if(e.content){var n=JSON.parse(e.content);void 0!==n.format?L(e,function(e){p(e,o)}):p(e,o)}else p(e,o)}function p(o,t){var a=o&&o.name||"";if(document.title="工程编辑-"+a,o.content){var c=JSON.parse(o.content),s=o.resolution.split("*").map(function(e){return Number(e)});c.name=o.name,c.author=o.author,c.initSize={width:s[0],height:s[1]},c.currentSize={width:s[0],height:s[1]},c.maxSize=o.maxSize,c.projectId=t;var u=c.resourceList,d=u.length,f=i.getGlobalResources();window.globalResources=f;var g=function(o,t){"error"===o.type?(toastr.warning("图片加载失败: "+t.name),t.complete=!1):t.complete=!0,(d-=1)<=0&&(l.saveProjectFromGlobal(c),C(c),n.saveProjectFromGlobal(c,function(){e.$broadcast("GlobalProjectReceived")}))}.bind(this);if(d>0)for(var b=0;b<u.length;b++){var m=u[b];i.cacheFileToGlobalResources(m,g,g)}else l.saveProjectFromGlobal(c),C(c),n.saveProjectFromGlobal(c,function(){e.$broadcast("GlobalProjectReceived")})}else{c=r.getBlankProject(),c.projectId=t;var s=o.resolution.split("*").map(function(e){return Number(e)});c.initSize={width:s[0],height:s[1]},c.currentSize={width:s[0],height:s[1]},c.maxSize=o.maxSize,console.log("globalProject new",_.cloneDeep(c)),l.saveProjectFromGlobal(c),C(c),n.saveProjectFromGlobal(c,function(){e.$broadcast("GlobalProjectReceived")})}}function v(o,t){var a=r.getBlankProject();a.projectId=t;var c=(o.resolution||"800*480").split("*").map(function(e){return Number(e)});a.initSize={width:c[0],height:c[1]},a.currentSize={width:c[0],height:c[1]},a.maxSize=o.maxSize||104857600,console.log("globalProject",a),l.saveProjectFromGlobal(a),n.saveProjectFromGlobal(a,function(){C(a),e.$broadcast("GlobalProjectReceived")})}function S(){for(var o=window.location.href,a=o.split("/"),n="",r=0;r<a.length;r++)if("project"==a[r]){n=a[r+1];break}i.setResourceUrl("/project/"+n+"/resources/"),t({method:"GET",url:baseUrl+"/project/"+n+"/content"}).success(function(e){h(e,n)}).error(function(e){toastr.warning("读取错误"),v({},n)}),e.$on("LoadUp",function(){6==++I&&w()})}function w(){o(function(){e.ide.loaded=!0,window.spinner&&window.spinner.hide()},200)}function y(a){var c={};if(!a)return o(function(){toastr.info("加载离线项目"),c=r.getBlankProject(),l.saveProjectFromGlobal(c),n.saveProjectFromGlobal(c,function(){PID=a,C(c),e.$broadcast("GlobalProjectReceived")})}),void logs.push("打开本地项目");console.log(TOKEN);!function(o){t({method:"GET",url:baseUrl+"/project",params:{token:window.localStorage.getItem("token"),pid:a}}).success(function(o){console.log(o),"success"==o.status?(c=o.project.data,c?(l.saveProjectFromGlobal(c),n.saveProjectFromGlobal(c,function(){PID=a,C(c),e.$broadcast("GlobalProjectReceived"),logs.push("从服务器获取项目")})):(console.log("获取信息失败"),P())):(console.log("获取信息失败"),P())}).error(function(e){console.log(e),P()})}()}function $(o,t){e.ide.loaded=!1,I=0,y(t)}function P(){try{console.log("读取缓存");var o=PID,t=JSON.parse(window.localStorage.getItem("projectCache"+o)),a=t;console.log(a),l.saveProjectFromGlobal(a),n.saveProjectFromGlobal(a,function(){C(a),e.$broadcast("GlobalProjectReceived")})}catch(e){toastr.info("获取项目失败")}}function C(e){i.setMaxTotalSize(e.maxSize||104857600),i.syncFiles(e.resourceList),s.syncCustomTags(e.customTags),s.syncTimerTags(e.timerTags),s.setTimerNum(e.timers),g.setCANId(e.CANId)}function j(e,o){var t=_.cloneDeep(e),a=i.getResourceUrl()+"template/",n="";for(var r in t)t[r]instanceof Array?t[r].forEach(function(e){n=e.src&&e.src.split("/"),n=n[n.length-1],n=a+n,e.src=n}):t[r].texList&&t[r].texList.forEach(function(e){e.slices&&e.slices.forEach(function(e){""!==e.imgSrc&&(n=e.imgSrc&&e.imgSrc.split("/"),n=n[n.length-1],n=a+n,e.imgSrc=n)})});i.setTemplateFiles(t.templateResourcesList),l.setDefaultWidget(t);var c=t.templateResourcesList||[],s=c.length,u=function(e,t){"error"===e.type?(toastr.warning("图片加载失败: "+t.name),t.complete=!1):t.complete=!0,--s<=0&&o&&o()};s>0?c.map(function(e,o){i.cacheFileToGlobalResources(e,u,u)}):o&&o()}function L(e,o){var t,a=_.cloneDeep(e),n=0,r=JSON.parse(e.content),c=[],i=new fabric.Canvas("c"),s=new fabric.Canvas("c1",{renderOnAddRemove:!1});for(a.thumbnail="",a.template="",a.supportTouch="false",r.currentSize=_.cloneDeep(r.size),r.customTags=_.cloneDeep(r.tagList),r.projectId=window.location.pathname&&window.location.pathname.split("/")[2],r.initSize=_.cloneDeep(r.size),r.pages=_.cloneDeep(r.pageList),n=0;n<r.tagList.length;n++)if(void 0===r.tagList[n].type){t=n;break}r.timerTags=t>0?r.customTags.splice(t,r.customTags.length-t):[],c=["size","tagList","basicUrl","format","name","author","pageList"],N(r,c),n=0;var l,t,u=r.pages.length,d=function(){l=null,l=r.pages[n],t=n,i.setWidth(r.initSize.width),i.setHeight(r.initSize.height),i.zoomToPoint(new fabric.Point(0,0),1),void 0!==l.canvasList&&(l.selected=0===t,l.layers=l.canvasList,c=["canvasList","linkedAllWidgets"],N(l,c),l.actions&&l.actions.forEach(function(e){if(e.commands){var o;o=e.commands.map(function(e){return e.cmd}),e.commands=o}}),l.layers.forEach(function(e,o){e.subLayers=e.subCanvasList,e.subLayers.forEach(function(o,t){o.widgets=o.widgetList,c=["widgetList"],N(o,c),s.setWidth(e.w),s.setHeight(e.h),s.zoomToPoint(new fabric.Point(0,0),1),o.current=!1,o.expand=!0,o.selected=!1,o.url="",o.actions&&o.actions.forEach(function(e){if(e.commands){var o;o=e.commands.map(function(e){return e.cmd}),e.commands=o}}),o.widgets.forEach(function(e,o){e.type=e.subType,N(e,["subType"]),e.current=!1,e.currentFabwidget=null,e.expand=!0,e.selected=!1,e.actions&&e.actions.forEach(function(e){if(e.commands){var o;o=e.commands.map(function(e){return e.cmd}),e.commands=o}}),e.texList&&e.texList instanceof Array&&e.texList.forEach(function(e,o){e.slices&&e.slices instanceof Array&&e.slices.forEach(function(e,o){e.hasOwnProperty("originSrc")&&(e.imgSrc=e.originSrc,delete e.originSrc)})}),T(e,s)}),o.proJsonStr=s.toJSON(),s.clear()}),e.info={},e.info.width=e.w,e.info.height=e.h,e.info.top=e.y,e.info.left=e.x,e.zIndex=o,e.current=!1,e.expand=!0,e.selected=!1,e.showSubLayer=e.subLayers[0],e.url="",c=["w","h","y","x","subCanvasList"],N(e,c),T(e,i)}),l.backgroundImage&&""!==l.backgroundImage?i.setBackgroundImage(l.backgroundImage,function(){i.setBackgroundColor(l.backgroundColor,function(){l.proJsonStr=i.toJSON(),i.clear(),n++,n<u?d():(a.content=JSON.stringify(r),o&&o(a))})},{width:i.getWidth(),height:i.getHeight()}):i.setBackgroundImage(null,function(){i.setBackgroundColor(l.backgroundColor,function(){l.proJsonStr=i.toJSON(),i.clear(),n++,n<u?d():(a.content=JSON.stringify(r),o&&o(a))})}))};d()}function N(e,o){return o instanceof Array&&o.forEach(function(o,t){delete e[o]}),e}function T(e,o,t){var a={width:e.info.width,height:e.info.height,top:e.info.top,left:e.info.left,id:e.id,lockScalingFlip:!0,hasRotatingPoint:!1,shadow:{color:"rgba(0,0,0,0.4)",blur:2}},n=function(e){o.add(e)};switch(e.type){case"MySlide":fabric.MySlide.fromLevel(e,n,a);break;case"MyProgress":fabric.MyProgress.fromLevel(e,n,a);break;case"MyDashboard":fabric.MyDashboard.fromLevel(e,n,a);break;case"MyButton":fabric.MyButton.fromLevel(e,n,a);break;case"MyButtonGroup":fabric.MyButtonGroup.fromLevel(e,n,a);break;case"MyNumber":fabric.MyNumber.fromLevel(e,n,a);break;case"MyTextArea":fabric.MyTextArea.fromLevel(e,n,a);break;case"MyKnob":fabric.MyKnob.fromLevel(e,n,a);break;case"MyOscilloscope":fabric.MyOscilloscope.fromLevel(e,n,a);break;case"MySwitch":fabric.MySwitch.fromLevel(e,n,a);break;case"MyRotateImg":fabric.MyRotateImg.fromLevel(e,n,a);break;case"MyDateTime":fabric.MyDateTime.fromLevel(e,n,a);break;case"MyScriptTrigger":fabric.MyScriptTrigger.fromLevel(e,n,a);break;case"MyVideo":fabric.MyVideo.fromLevel(e,n,a);break;case"MyAnimation":fabric.MyAnimation.fromLevel(e,n,a);break;case"MyLayer":o.add(new fabric.MyLayer(e,a));break;case"MyNum":o.add(new fabric.MyNum(e,a));break;case"MyTexNum":o.add(new fabric.MyTexNum(e,a));break;default:console.log("not match widget in preprocess!")}}ideScope=e,e.ide={loaded:!1};var M,k,G,I=0;!function(){e.leftShown=!0,e.rightShown=!0,e.bottomShown=!0;try{require("os")&&(window.local=!0,e.local=!0,window.ondragover=function(e){return e.preventDefault(),!1},window.ondrop=function(e){return e.preventDefault(),!1},G=global.__dirname,k=require("path"),M=require("fs"))}catch(e){window.local=!1}}(),function(){window.local?b():S()}(),function(){var e="basic";if(window.local){var o=k.join(G,"public","nw","userInfo.json"),t={name:"",type:"basic"};M.existsSync(o)||M.writeFileSync(o,JSON.stringify(t)),e=JSON.parse(M.readFileSync(o,"utf-8")).type}else e=localStorage.getItem("userType");d.setUserType(e)}(),function(){e.$on("ChangePageNode",function(){e.$broadcast("PageNodeChanged"),e.$broadcast("NavStatusChanged")}),e.$on("ChangeCurrentPage",function(o,t,a){e.$broadcast("CurrentPageChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged"),document.getElementById("saveFlag").value="false"}),e.$on("ChangeCurrentSubLayer",function(o,t,a){e.$broadcast("CurrentSubLayerChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("SwitchCurrentPage",function(o,t,a){e.$broadcast("PageChangedSwitched",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("ChangeToolShow",function(o,t){e.$broadcast("ToolShowChanged",t),e.$broadcast("NavStatusChanged")}),e.$on("AddNewPage",function(o,t,a){e.$broadcast("NewPageAdded",t,a),e.$broadcast("PageNodeChanged"),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("changeCanvasScale",function(o,t){e.$broadcast("CanvasScaleChanged",t)}),e.$on("UpdateProject",function(o){e.$broadcast("ProjectUpdated"),document.getElementById("saveFlag").value="true"}),e.$on("Undo",function(o,t,a){e.$broadcast("OperateQueChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("PageNodeChanged"),e.$broadcast("AttributeChanged")}),e.$on("Redo",function(o,t,a){e.$broadcast("OperateQueChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("PageNodeChanged"),e.$broadcast("AttributeChanged")}),e.$on("DoCopy",function(o){e.$broadcast("NavStatusChanged")}),e.$on("ResourceUpdate",function(){e.$broadcast("AttributeChanged"),e.$broadcast("ResourceChanged")}),e.$on("ReOpenProject",$),e.$on("ChangeShownArea",function(o,t){switch(console.log(t),t){case 0:e.leftShown=!e.leftShown;break;case 1:e.rightShown=!e.rightShown;break;case 2:e.bottomShown=!e.bottomShown}})}(),function(){fabric.FX_DURATION=c.FX_DURATION}(),function(){window.local||setInterval(function(){t({method:"GET",url:baseUrl+"/api/refreshlogin"}).success(function(e){console.log(e)}).error(function(e){console.log(e)})},6e5)}()}]);