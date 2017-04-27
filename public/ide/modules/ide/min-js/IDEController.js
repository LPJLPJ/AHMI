var ide=angular.module("ide",["ui.bootstrap.contextMenu","colorpicker.module","ui.sortable","btford.modal","ui.bootstrap","ngAnimate","GlobalModule","ui.tree","IDEServices"]);ide.config(["$compileProvider",function(e){e.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/),e.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension|chrome-extension):/)}]);var baseUrl="",PID="",TOKEN="",MAX_DATA_LENGTH=1e5,ideScope,isOffline,mode="BUILD";console.log=function(e){return"DEBUG"===mode?e.log:(e.oldLog=e.log,function(){})}(console);var logs=[];ide.controller("IDECtrl",["$scope","$timeout","$http","$interval","ProjectService","GlobalService","Preference","ResourceService","TagService","TemplateProvider","TimerService","UserTypeService","WidgetService","NavModalCANConfigService",function(e,o,t,a,n,r,c,i,l,s,u,d,g,f){function h(){var t=window.location.href,a=t.split("?")[1].split("=")[1];"#"===a[a.length-1]&&(a=a.slice(0,-1)),console.log(a);var n=T.join(F,"localproject",a);i.setProjectUrl(n);var r=T.join(n,"resources");i.setResourceUrl(r);var c=T.join(F,T.dirname(window.location.pathname));i.setResourceNWUrl(T.relative(c,r)),console.log(T.relative(c,r));var l=b(T.join(n,"project.json"));o(function(){l?(l=JSON.parse(l),p(l,a)):v({},a)},0),e.$on("LoadUp",function(){6==++y&&w()})}function b(e,o){if(!o)return G.readFileSync(e,"utf-8");try{var t=G.statSync(e);return t&&t.isFile()?G.readFileSync(e,"utf-8"):null}catch(e){return null}}function m(e,o){var a=e.template;s.setTemplateId(a),a&&""!==a?t({method:"GET",url:"/public/templates/defaultTemplate/defaultTemplate.json"}).success(function(t){N(t,function(){p(e,o)}.bind(this))}).error(function(e){console.log("get json failed")}):p(e,o)}function p(o,t){if(o.content){var a=JSON.parse(o.content),c=o.resolution.split("*").map(function(e){return Number(e)});a.initSize={width:c[0],height:c[1]},a.currentSize={width:c[0],height:c[1]},a.maxSize=o.maxSize,a.projectId=t;var l=a.resourceList;console.log("resourceList",l);var u=l.length,d=i.getGlobalResources();window.globalResources=d;var g=function(o,t){"error"===o.type?(toastr.warning("图片加载失败: "+t.name),t.complete=!1):t.complete=!0,(u-=1)<=0&&(s.saveProjectFromGlobal(a),C(a),n.saveProjectFromGlobal(a,function(){e.$broadcast("GlobalProjectReceived")}))}.bind(this);if(u>0)for(var f=0;f<l.length;f++){var h=l[f];console.log("caching ",f),i.cacheFileToGlobalResources(h,g,g)}else console.log(a),s.saveProjectFromGlobal(a),C(a),n.saveProjectFromGlobal(a,function(){e.$broadcast("GlobalProjectReceived")})}else{a=r.getBlankProject(),a.projectId=t;var c=o.resolution.split("*").map(function(e){return Number(e)});a.initSize={width:c[0],height:c[1]},a.currentSize={width:c[0],height:c[1]},a.maxSize=o.maxSize,console.log("globalProject new",_.cloneDeep(a)),s.saveProjectFromGlobal(a),C(a),n.saveProjectFromGlobal(a,function(){e.$broadcast("GlobalProjectReceived")})}}function v(o,t){var a=r.getBlankProject();a.projectId=t;var c=(o.resolution||"800*480").split("*").map(function(e){return Number(e)});a.initSize={width:c[0],height:c[1]},a.currentSize={width:c[0],height:c[1]},a.maxSize=o.maxSize||104857600,console.log("globalProject",a),s.saveProjectFromGlobal(a),n.saveProjectFromGlobal(a,function(){C(a),e.$broadcast("GlobalProjectReceived")})}function S(){for(var o=window.location.href,a=o.split("/"),n="",r=0;r<a.length;r++)if("project"==a[r]){n=a[r+1];break}i.setResourceUrl("/project/"+n+"/resources/"),t({method:"GET",url:baseUrl+"/project/"+n+"/content"}).success(function(e){m(e,n)}).error(function(e){toastr.warning("读取错误"),v({},n)}),e.$on("LoadUp",function(){6==++y&&w()})}function w(){o(function(){e.ide.loaded=!0,window.spinner&&window.spinner.hide()},200)}function $(a){var c={};if(!a)return o(function(){toastr.info("加载离线项目"),c=r.getBlankProject(),s.saveProjectFromGlobal(c),n.saveProjectFromGlobal(c,function(){PID=a,C(c),e.$broadcast("GlobalProjectReceived")})}),void logs.push("打开本地项目");console.log(TOKEN);!function(o){t({method:"GET",url:baseUrl+"/project",params:{token:window.localStorage.getItem("token"),pid:a}}).success(function(o){console.log(o),"success"==o.status?(c=o.project.data,c?(s.saveProjectFromGlobal(c),n.saveProjectFromGlobal(c,function(){PID=a,C(c),e.$broadcast("GlobalProjectReceived"),logs.push("从服务器获取项目")})):(console.log("获取信息失败"),P())):(console.log("获取信息失败"),P())}).error(function(e){console.log(e),P()})}()}function j(o,t){e.ide.loaded=!1,y=0,$(t)}function P(){try{console.log("读取缓存");var o=PID,t=JSON.parse(window.localStorage.getItem("projectCache"+o)),a=t;console.log(a),s.saveProjectFromGlobal(a),n.saveProjectFromGlobal(a,function(){C(a),e.$broadcast("GlobalProjectReceived")})}catch(e){toastr.info("获取项目失败")}}function C(e){i.setMaxTotalSize(e.maxSize||104857600),i.syncFiles(e.resourceList),l.syncCustomTags(e.customTags),l.syncTimerTags(e.timerTags),l.setTimerNum(e.timers),f.setCANId(e.CANId)}function N(e,o){var t=_.cloneDeep(e),a=i.getResourceUrl()+"template/",n="";for(var r in t)t[r]instanceof Array?t[r].forEach(function(e){n=e.src&&e.src.split("/"),n=n[n.length-1],n=a+n,e.src=n}):t[r].texList&&t[r].texList.forEach(function(e){e.slices&&e.slices.forEach(function(e){n=e.imgSrc&&e.imgSrc.split("/"),n=n[n.length-1],n=a+n,e.imgSrc=n})});i.setTemplateFiles(t.templateResourcesList),s.setDefaultWidget(t);var c=t.templateResourcesList||[],l=c.length,u=function(e,t){"error"===e.type?(toastr.warning("图片加载失败: "+t.name),t.complete=!1):t.complete=!0,--l<=0&&o&&o()};l>0?c.map(function(e,o){i.cacheFileToGlobalResources(e,u,u)}):o&&o()}ideScope=e,e.ide={loaded:!1};var G,T,F,y=0;!function(){e.leftShown=!0,e.rightShown=!0,e.bottomShown=!0;try{require("os")&&(window.local=!0,e.local=!0,window.ondragover=function(e){return e.preventDefault(),!1},window.ondrop=function(e){return e.preventDefault(),!1},F=global.__dirname,T=require("path"),G=require("fs"))}catch(e){window.local=!1}}(),function(){window.local?h():S()}(),function(){var e="basic";if(window.local){var o=T.join(F,"public","nw","userInfo.json"),t={name:"",type:"basic"};G.existsSync(o)||G.writeFileSync(o,JSON.stringify(t)),e=JSON.parse(G.readFileSync(o,"utf-8")).type}else e=localStorage.getItem("userType");d.setUserType(e)}(),function(){e.$on("ChangePageNode",function(){e.$broadcast("PageNodeChanged"),e.$broadcast("NavStatusChanged")}),e.$on("ChangeCurrentPage",function(o,t,a){e.$broadcast("CurrentPageChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged"),document.getElementById("saveFlag").value="false"}),e.$on("ChangeCurrentSubLayer",function(o,t,a){e.$broadcast("CurrentSubLayerChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("SwitchCurrentPage",function(o,t,a){e.$broadcast("PageChangedSwitched",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("ChangeToolShow",function(o,t){e.$broadcast("ToolShowChanged",t),e.$broadcast("NavStatusChanged")}),e.$on("AddNewPage",function(o,t,a){e.$broadcast("NewPageAdded",t,a),e.$broadcast("PageNodeChanged"),e.$broadcast("NavStatusChanged"),e.$broadcast("AttributeChanged")}),e.$on("changeCanvasScale",function(o,t){e.$broadcast("CanvasScaleChanged",t)}),e.$on("UpdateProject",function(o){e.$broadcast("ProjectUpdated"),document.getElementById("saveFlag").value="true"}),e.$on("Undo",function(o,t,a){e.$broadcast("OperateQueChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("PageNodeChanged"),e.$broadcast("AttributeChanged")}),e.$on("Redo",function(o,t,a){e.$broadcast("OperateQueChanged",t,a),e.$broadcast("NavStatusChanged"),e.$broadcast("PageNodeChanged"),e.$broadcast("AttributeChanged")}),e.$on("DoCopy",function(o){e.$broadcast("NavStatusChanged")}),e.$on("ResourceUpdate",function(){e.$broadcast("AttributeChanged"),e.$broadcast("ResourceChanged")}),e.$on("ReOpenProject",j),e.$on("ChangeShownArea",function(o,t){switch(console.log(t),t){case 0:e.leftShown=!e.leftShown;break;case 1:e.rightShown=!e.rightShown;break;case 2:e.bottomShown=!e.bottomShown}})}(),function(){fabric.FX_DURATION=c.FX_DURATION}(),function(){window.local||setInterval(function(){t({method:"GET",url:baseUrl+"/api/refreshlogin"}).success(function(e){console.log(e)}).error(function(e){console.log(e)})},6e5)}()}]);