var ide=angular.module("ide",["ui.bootstrap.contextMenu","colorpicker.module","btford.modal","ui.bootstrap","ngAnimate","GlobalModule","ui.tree","IDEServices"]);ide.config(["$compileProvider",function(e){e.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/),e.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension|chrome-extension):/)}]);var baseUrl="",PID="",TOKEN="",MAX_DATA_LENGTH=1e5,ideScope,isOffline,mode="DEBUG",timeStamp=Date.now();console.log=function(e){return"DEBUG"===mode?e.log:(e.oldLog=e.log,function(){})}(console);var logs=[];ide.controller("IDECtrl",["$scope","$timeout","$http","$interval","ProjectService","GlobalService","Preference","ResourceService","TagService","TemplateProvider","TimerService","UserTypeService","WidgetService","NavModalCANConfigService","socketIOService","MiddleWareService",function(e,o,t,n,a,r,c,i,s,l,u,d,f,g,m,p){function h(e){window.spinner&&window.spinner.update(100*e)}function b(){var t=(window.location.href,window.location.search);t&&t.length&&(t=t.slice(1));var n=t.split("&")||[],a={};n.forEach(function(e){var o=e.split("=");2==o.length&&(a[o[0]]=o[1])});var r=a.project_id,c=a.v;console.log(r);var s=x.join(D,"localproject",r);i.setProjectUrl(s);var l=x.join(s,"resources");i.setResourceUrl(l);var u=x.join(D,x.dirname(window.location.pathname));i.setResourceNWUrl(x.relative(u,l)),console.log(x.relative(u,l));var d=w(x.join(s,"project.json"));o(function(){d?(d=JSON.parse(d),d.backups=d.backups||[],d.backups.length>0&&c in d.backups&&(d.content=d.backups[c].content||""),d.backups=[],S(d,r)):y({},r)},0),e.$on("LoadUp",function(){6==++U&&C()})}function w(e,o){if(!o)return G.readFileSync(e,"utf-8");try{var t=G.statSync(e);return t&&t.isFile()?G.readFileSync(e,"utf-8"):null}catch(e){return null}}function v(e,o){var n=e.template;if(l.setTemplateId(n),n&&""!==n)t({method:"GET",url:"/public/templates/defaultTemplate/defaultTemplate.json"}).success(function(t){L(t,function(){var t;t="string"==typeof e?JSON.parse(e):e,void 0!==t.format||"base"===t.DSFlag?N(e,function(e){S(e,o)}):S(e,o)}.bind(this))}).error(function(e){console.log("get json failed")});else if(e.content){var a=JSON.parse(e.content);void 0!==a.format?N(e,function(e){S(e,o)}):S(e,o)}else S(e,o)}function S(o,t){o.shared&&(o.readOnlyState?(toastr.options.closeButton=!0,toastr.options.timeOut=0,toastr.warning("注意：您无法执行保存工程操作","只读模式"),toastr.options.closeButton=close,toastr.options.timeOut=1e3):m.getSocket()||O(o.userId));var n=o&&o.name||"";if(document.title="工程编辑-"+n,o.content){var c=JSON.parse(o.content);console.log("globalProject",c),timeStamp=Date.now(),p.useMiddleWare(c),console.log("time costs in inject Data:",Date.now()-timeStamp);var s=o.resolution.split("*").map(function(e){return Number(e)});c.name=o.name,c.author=o.author,c.initSize={width:s[0],height:s[1]},c.currentSize={width:s[0],height:s[1]},c.maxSize=o.maxSize,c.projectId=t;var u=c.resourceList,d=u.length,f=u.length,g=i.getGlobalResources();window.globalResources=g;var b=function(o,t){"error"===o.type?(toastr.warning("资源加载失败: "+t.name),t.complete=!1):t.complete=!0,d-=1,h((f-d)/f),d<=0&&(console.log("time cost in cache imge :",Date.now()-timeStamp),l.saveProjectFromGlobal(c),T(c),timeStamp=Date.now(),a.saveProjectFromGlobal(c,function(){e.$broadcast("GlobalProjectReceived"),console.log("time cost in render",Date.now()-timeStamp)}))}.bind(this);if(d>0){timeStamp=Date.now();for(var w=0;w<u.length;w++){var v=u[w];i.cacheFileToGlobalResources(v,b,b)}}else h(100),l.saveProjectFromGlobal(c),T(c),a.saveProjectFromGlobal(c,function(){e.$broadcast("GlobalProjectReceived")})}else{c=r.getBlankProject(),c.projectId=t;var s=o.resolution.split("*").map(function(e){return Number(e)});c.initSize={width:s[0],height:s[1]},c.currentSize={width:s[0],height:s[1]},c.maxSize=o.maxSize,l.saveProjectFromGlobal(c),T(c),a.saveProjectFromGlobal(c,function(){e.$broadcast("GlobalProjectReceived")})}}function y(o,t){var n=r.getBlankProject();n.projectId=t;var c=(o.resolution||"800*480").split("*").map(function(e){return Number(e)});n.initSize={width:c[0],height:c[1]},n.currentSize={width:c[0],height:c[1]},n.maxSize=o.maxSize||104857600,console.log("globalProject",n),l.saveProjectFromGlobal(n),a.saveProjectFromGlobal(n,function(){T(n),e.$broadcast("GlobalProjectReceived")})}function $(){for(var o=window.location.href,n=o.split("/"),a="",r=0;r<n.length;r++)if("project"==n[r]){a=n[r+1];break}i.setResourceUrl("/project/"+a+"/resources/"),t({method:"GET",url:baseUrl+"/project/"+a+"/content"+(window.location.search||"")}).success(function(e){v(e,a)}).error(function(e){toastr.warning("读取错误"),y({},a)}),e.$on("LoadUp",function(){6==++U&&C()})}function C(){o(function(){e.ide.loaded=!0,window.spinner&&window.spinner.hide(!0)},200)}function P(n){var c={};if(!n)return o(function(){toastr.info("加载离线项目"),c=r.getBlankProject(),l.saveProjectFromGlobal(c),a.saveProjectFromGlobal(c,function(){PID=n,T(c),e.$broadcast("GlobalProjectReceived")})}),void logs.push("打开本地项目");console.log(TOKEN);!function(o){t({method:"GET",url:baseUrl+"/project",params:{token:window.localStorage.getItem("token"),pid:n}}).success(function(o){console.log(o),"success"==o.status?(c=o.project.data,c?(l.saveProjectFromGlobal(c),a.saveProjectFromGlobal(c,function(){PID=n,T(c),e.$broadcast("GlobalProjectReceived"),logs.push("从服务器获取项目")})):(console.log("获取信息失败"),k())):(console.log("获取信息失败"),k())}).error(function(e){console.log(e),k()})}()}function j(o,t){e.ide.loaded=!1,U=0,P(t)}function k(){try{console.log("读取缓存");var o=PID,t=JSON.parse(window.localStorage.getItem("projectCache"+o)),n=t;console.log(n),l.saveProjectFromGlobal(n),a.saveProjectFromGlobal(n,function(){T(n),e.$broadcast("GlobalProjectReceived")})}catch(e){toastr.info("获取项目失败")}}function T(e){i.setMaxTotalSize(e.maxSize||104857600),i.syncFiles(e.resourceList),s.syncCustomTags(e.customTags),s.syncTimerTags(e.timerTags),s.setTimerNum(e.timers),g.setCANId(e.CANId)}function L(e,o){var t=_.cloneDeep(e),n=i.getResourceUrl()+"template/",a="";for(var r in t)t[r]instanceof Array?t[r].forEach(function(e){a=e.src&&e.src.split("/"),a=a[a.length-1],a=n+a,e.src=a}):t[r].texList&&t[r].texList.forEach(function(e){e.slices&&e.slices.forEach(function(e){""!==e.imgSrc&&(a=e.imgSrc&&e.imgSrc.split("/"),a=a[a.length-1],a=n+a,e.imgSrc=a)})});i.setTemplateFiles(t.templateResourcesList),l.setDefaultWidget(t);var c=t.templateResourcesList||[],s=c.length,u=function(e,t){"error"===e.type?(toastr.warning("图片加载失败: "+t.name),t.complete=!1):t.complete=!0,--s<=0&&o&&o()};s>0?c.map(function(e,o){i.cacheFileToGlobalResources(e,u,u)}):o&&o()}function N(e,o){var t,n=_.cloneDeep(e),a=0,r=JSON.parse(e.content),c=[],i=new fabric.Canvas("c"),s=new fabric.Canvas("c1",{renderOnAddRemove:!1});for(n.thumbnail="",n.template="",n.supportTouch="false",r.currentSize=_.cloneDeep(r.size),r.customTags=_.cloneDeep(r.tagList),r.projectId=window.location.pathname&&window.location.pathname.split("/")[2],r.initSize=_.cloneDeep(r.size),r.pages=_.cloneDeep(r.pageList),a=0;a<r.tagList.length;a++)if(void 0===r.tagList[a].type){t=a;break}r.timerTags=t>0?r.customTags.splice(t,r.customTags.length-t):[],c=["size","tagList","basicUrl","format","name","author","pageList"],M(r,c),a=0;var l,t,u=r.pages.length,d=function(){l=null,l=r.pages[a],t=a,i.setWidth(r.initSize.width),i.setHeight(r.initSize.height),i.zoomToPoint(new fabric.Point(0,0),1),void 0!==l.canvasList&&(l.selected=0===t,l.layers=l.canvasList,c=["canvasList","linkedAllWidgets"],M(l,c),l.actions&&l.actions.forEach(function(e){if(e.commands){var o;o=e.commands.map(function(e){return e.cmd}),e.commands=o}}),l.layers.forEach(function(e,o){e.subLayers=e.subCanvasList,e.subLayers.forEach(function(o,t){o.widgets=o.widgetList,c=["widgetList"],M(o,c),s.setWidth(e.w),s.setHeight(e.h),s.zoomToPoint(new fabric.Point(0,0),1),o.current=!1,o.expand=!0,o.selected=!1,o.url="",o.actions&&o.actions.forEach(function(e){if(e.commands){var o;o=e.commands.map(function(e){return e.cmd}),e.commands=o}}),o.widgets.forEach(function(e,o){e.type=e.subType,M(e,["subType"]),e.current=!1,e.currentFabwidget=null,e.expand=!0,e.selected=!1,e.actions&&e.actions.forEach(function(e){if(e.commands){var o;o=e.commands.map(function(e){return e.cmd}),e.commands=o}}),e.texList&&e.texList instanceof Array&&e.texList.forEach(function(e,o){e.slices&&e.slices instanceof Array&&e.slices.forEach(function(e,o){e.hasOwnProperty("originSrc")&&(e.imgSrc=e.originSrc,delete e.originSrc)})}),I(e,s)}),o.proJsonStr=s.toJSON(),s.clear()}),e.info={},e.info.width=e.w,e.info.height=e.h,e.info.top=e.y,e.info.left=e.x,e.zIndex=o,e.current=!1,e.expand=!0,e.selected=!1,e.showSubLayer=e.subLayers[0],e.url="",c=["w","h","y","x","subCanvasList"],M(e,c),I(e,i)}),l.backgroundImage&&""!==l.backgroundImage?i.setBackgroundImage(l.backgroundImage,function(){i.setBackgroundColor(l.backgroundColor,function(){l.proJsonStr=i.toJSON(),i.clear(),a++,a<u?d():(n.content=JSON.stringify(r),o&&o(n))})},{width:i.getWidth(),height:i.getHeight()}):i.setBackgroundImage(null,function(){i.setBackgroundColor(l.backgroundColor,function(){l.proJsonStr=i.toJSON(),i.clear(),a++,a<u?d():(n.content=JSON.stringify(r),o&&o(n))})}))};d()}function M(e,o){return o instanceof Array&&o.forEach(function(o,t){delete e[o]}),e}function I(e,o,t){var n={width:e.info.width,height:e.info.height,top:e.info.top,left:e.info.left,id:e.id,lockScalingFlip:!0,hasRotatingPoint:!1,shadow:{color:"rgba(0,0,0,0.4)",blur:2}},a=function(e){o.add(e)};switch(e.type){case"MySlide":fabric.MySlide.fromLevel(e,a,n);break;case"MyProgress":fabric.MyProgress.fromLevel(e,a,n);break;case"MyDashboard":fabric.MyDashboard.fromLevel(e,a,n);break;case"MyButton":fabric.MyButton.fromLevel(e,a,n);break;case"MyButtonGroup":fabric.MyButtonGroup.fromLevel(e,a,n);break;case"MyNumber":fabric.MyNumber.fromLevel(e,a,n);break;case"MyTextArea":fabric.MyTextArea.fromLevel(e,a,n);break;case"MyKnob":fabric.MyKnob.fromLevel(e,a,n);break;case"MyOscilloscope":fabric.MyOscilloscope.fromLevel(e,a,n);break;case"MySwitch":fabric.MySwitch.fromLevel(e,a,n);break;case"MyRotateImg":fabric.MyRotateImg.fromLevel(e,a,n);break;case"MyDateTime":fabric.MyDateTime.fromLevel(e,a,n);break;case"MyScriptTrigger":fabric.MyScriptTrigger.fromLevel(e,a,n);break;case"MyVideo":fabric.MyVideo.fromLevel(e,a,n);break;case"MyAnimation":fabric.MyAnimation.fromLevel(e,a,n);break;case"MyLayer":o.add(new fabric.MyLayer(e,n));break;case"MyNum":o.add(new fabric.MyNum(e,n));break;case"MyTexNum":o.add(new fabric.MyTexNum(e,n));break;case"MyTexTime":o.add(new fabric.MyTexTime(e,n));break;default:console.error("not match widget in preprocess!")}}function O(t){m.createSocket("",function(n){console.log("you have connect"),m.on("connect:success",function(o,n){m.setRoomUsers(o),e.currentUser=n,(A=o[0]&&o[0].id===e.currentUser.id)||(console.log("wenerId",t,"currId",n.id),e.projectOwner=t===n.id,e.wrapperForCoop=!0,e.currentUsers=m.getRoomUsers())}),m.on("user:enter",function(o){toastr.info("用户 "+o.username+"加入"),e.$apply(function(){e.currentUsers=m.addUserInRoom(o)})}),m.on("user:leave",function(t){toastr.info("用户 "+t.username+" 已离开"),e.$apply(function(){e.currentUsers=m.deleteUserInRoom(t)}),A||(A=e.currentUsers[0]&&e.currentUsers[0].id===e.currentUser.id,o(function(){A&&(alert("您已获得编辑工程的权限，即将重新加载工程"),window.spinner&&window.spinner.show(),e.wrapperForCoop=!1,U=0,$())},1500))}),m.on("room:close",function(){toastr.warning("管理员已经关闭共享，页面即将关闭"),m.closeSocket(function(){setTimeout(function(){F()},1e3)})})})}function F(){navigator.userAgent.indexOf("MSIE")>0?navigator.userAgent.indexOf("MSIE 6.0")>0?(window.opener=null,window.close()):(window.open("","_top"),window.top.close()):navigator.userAgent.indexOf("Firefox")>0?window.location.href="about:blank ":(window.opener=null,window.open("","_self",""),window.close())}ideScope=e,e.ide={loaded:!1};var G,x,D,U=0;!function(){e.leftShown=!0,e.rightShown=!0,e.bottomShown=!0;try{require("os")&&(window.local=!0,e.local=!0,window.ondragover=function(e){return e.preventDefault(),!1},window.ondrop=function(e){return e.preventDefault(),!1},D=global.__dirname,x=require("path"),G=require("fs"))}catch(e){window.local=!1}}(),function(){window.local?b():$()}(),function(){var e="basic";if(window.local){var o=x.join(D,"public","nw","userInfo.json"),t={name:"",type:"basic"};G.existsSync(o)||G.writeFileSync(o,JSON.stringify(t)),e=JSON.parse(G.readFileSync(o,"utf-8")).type}else e=localStorage.getItem("userType");d.setUserType(e)}(),function(){e.$on("ChangePageNode",function(){e.$broadcast("PageNodeChanged"),e.$broadcast("NavStatusChanged")}),e.$on("ChangeCurrentPage",function(o,t,n){e.$broadcast("CurrentPageChanged",t,n),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged"),document.getElementById("saveFlag").value="false"}),e.$on("ChangeCurrentSubLayer",function(o,t,n){e.$broadcast("CurrentSubLayerChanged",t,n),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("SwitchCurrentPage",function(o,t,n){e.$broadcast("PageChangedSwitched",t,n),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("ChangeToolShow",function(o,t){e.$broadcast("ToolShowChanged",t),e.$broadcast("NavStatusChanged")}),e.$on("AddNewPage",function(o,t,n){e.$broadcast("NewPageAdded",t,n),e.$broadcast("PageNodeChanged"),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("changeCanvasScale",function(o,t){e.$broadcast("CanvasScaleChanged",t)}),e.$on("UpdateProject",function(o){e.$broadcast("ProjectUpdated"),document.getElementById("saveFlag").value="true"}),e.$on("Undo",function(o,t,n){e.$broadcast("OperateQueChanged",t,n),e.$broadcast("NavStatusChanged"),e.$broadcast("PageNodeChanged"),e.$broadcast("AttributeChanged")}),e.$on("Redo",function(o,t,n){e.$broadcast("OperateQueChanged",t,n),e.$broadcast("NavStatusChanged"),e.$broadcast("PageNodeChanged"),e.$broadcast("AttributeChanged")}),e.$on("DoCopy",function(o){e.$broadcast("NavStatusChanged")}),e.$on("ResourceUpdate",function(){e.$broadcast("AttributeChanged"),e.$broadcast("ResourceChanged")}),e.$on("ReOpenProject",j),e.$on("ChangeShownArea",function(o,t){switch(console.log(t),t){case 0:e.leftShown=!e.leftShown;break;case 1:e.rightShown=!e.rightShown;break;case 2:e.bottomShown=!e.bottomShown}})}(),function(){fabric.FX_DURATION=c.FX_DURATION}(),function(){window.local||setInterval(function(){t({method:"GET",url:baseUrl+"/api/refreshlogin"}).success(function(e){console.log(e)}).error(function(e){console.log(e)})},6e5)}(),e.wrapperForCoop=!1,e.projectOwner=!1;var A=!1;e.openSimulator=function(){e.$broadcast("OpenSimulator")},e.cancelShare=function(){if(confirm("强制取消将对正在编辑的工程产生影响，确定取消分享？")){var o=window.location.href.split("/"),n=o[o.length-2];console.log("id",n),t({method:"POST",url:"/project/"+n+"/share",data:{share:!1}}).success(function(o,t,n){m.emit("room:close"),m.closeSocket(),toastr.info("取消成功,工程即将重新加载!"),setTimeout(function(){window.spinner&&window.spinner.show(),e.wrapperForCoop=!1,U=0,$()},1500)}).error(function(e){console.log(e)})}},e.$on("createSocketIO",function(){console.log("open share then create socketIO"),O()}),e.$on("closeSocketIO",function(){console.log("close share then close socketIO"),m.emit("room:close"),m.closeSocket()})}]);