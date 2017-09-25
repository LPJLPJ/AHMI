ideServices.service("ProjectTransformService",["Type",function(e){function a(e,a){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),a)}function r(e,r){if(r=r||!0,e&&e.actions&&e.actions.length)for(var t=0;t<e.actions.length;t++){var n=e.actions[t];n.commands=a(n.commands,r)}}function t(e){var a={};a.version=e.version,a.name=e.name||"default project",a.author=e.author||"author",a.size=e.currentSize,a.lastSaveTimeStamp=e.lastSaveTimeStamp,a.lastSaveUUID=e.lastSaveUUID,a.pageList=[];for(var r=0;r<e.pages.length;r++)a.pageList.push(n(e.pages[r],r));return a}function n(a,t){var n={};n.id=""+t,n.type=e.MyPage,u(a,n,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),r(n),n.canvasList=[];for(var s=0;s<a.layers.length;s++)n.canvasList.push(i(a.layers[s],s,n.id));return n}function i(a,t,n){var i={};i.id=n+"."+t,i.type=e.MyLayer,u(a,i,["name","triggers","actions","tag","zIndex","animations","transition"]),r(i),i.w=a.info.width,i.h=a.info.height,i.x=a.info.left,i.y=a.info.top,i.subCanvasList=[];for(var o=0;o<a.subLayers.length;o++){var c=a.subLayers[o];a.showSubLayer.id==c&&(i.curSubCanvasIdx=o),i.subCanvasList.push(s(c,o,i.id))}return i}function s(a,t,n){var i={};i.id=n+"."+t,i.type=e.MySubLayer,u(a,i,["name","tag","actions","zIndex","backgroundImage","backgroundColor"]),r(i),i.widgetList=[];for(var s=0;s<a.widgets.length;s++){var c=a.widgets[s];i.widgetList.push(o(c,s,i.id))}return i}function o(e,a,t){var n={};return n=_.cloneDeep(e),r(n),n.type="widget",n.subType=e.type,n.id=t+"."+a,n}function u(e,a,r){for(var t=0;t<r.length;t++){var n=r[t];"object"==typeof e[n]?a[n]=_.cloneDeep(e[n]):a[n]=e[n]}}function c(e){var a={};a.DSFlag="base",a.projectId=e.projectId,a.version=e.version,a.name=e.name||"default project",a.author=e.author||"author",a.CANId=e.CANId,a.lastSaveTimeStamp=e.lastSaveTimeStamp,a.lastSaveUUID=e.lastSaveUUID,a.size=e.currentSize;var r=e.pages;a.pages=[];for(var t=0;t<r.length;t++)a.pages.push(g(r[t]));return a}function g(e){var a={};u(e,a,["id","name","url","type","mode","selected","expand","current","currentFablayer","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),r(a);var t=e.layers;a.layers=[];for(var n=0;n<t.length;n++)a.layers.push(d(t[n]));return a}function d(e){var a={};u(e,a,["id","name","url","type","zIndex","info","selected","current","expand","actions","animations","transition"]),a.w=e.info.width,a.h=e.info.height,a.x=e.info.left,a.y=e.info.top;var r=e.subLayers;a.subLayers=[];for(var t=0;t<r.length;t++){var n=r[t];e.showSubLayer.id==n&&(a.curSubCanvasIdx=t),a.subLayers.push(v(n))}return a}function v(e){var a={};u(e,a,["id","name","url","type","selected","expand","current","tag","actions","zIndex","backgroundImage","backgroundColor"]);var r=e.widgets;a.widgets=[];for(var t=0;t<r.length;t++){var n=r[t];a.widgets.push(l(n))}return a}function l(e){return _.cloneDeep(e)}this.transDataFile=t,this.transDateFileBase=c}]);