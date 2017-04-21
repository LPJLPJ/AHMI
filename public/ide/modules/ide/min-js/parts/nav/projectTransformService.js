ideServices.service("ProjectTransformService",["Type",function(e){function t(e,t){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),t)}function o(e,o){if(o=o||!0,e&&e.actions&&e.actions.length)for(var a=0;a<e.actions.length;a++){var n=e.actions[a];n.commands=t(n.commands,o)}}function a(){var e=["onInitialize","onMouseUp","onMouseDown","onTagChange"],t={},o=WidgetModel.models,a=_.cloneDeep(WidgetCommands);console.log("models",o);for(var n in o)if(o.hasOwnProperty(n)){var r=_.cloneDeep(o[n].prototype.commands);d(r,e),t[n]=r}console.log("registered commands",t);var i={};for(var n in a)if(i[n]={},a.hasOwnProperty(n)){modelObj=a[n];for(var s=0;s<e.length;s++){var l=e[s];l in modelObj&&(modelObj[l]=ASTTransformer.transAST(widgetCompiler.parse(modelObj[l])),c(modelObj,l),i[n][l]=cppWidgetCommandTranslator.transJSWidgetCommands(modelObj[l]))}}return console.log("testModels",a),console.log("cppModels",i),{commands:a,cppModels:i}}function n(e){var t={};t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.size=e.currentSize;var o=a();t.generalWidgetCommands=o.commands,t.cppWidgetCommands=o.cppModels,t.pageList=[];for(var n=0;n<e.pages.length;n++)t.pageList.push(r(e.pages[n],n));return t}function r(t,a){var n={};n.id=""+a,n.type=e.MyPage,g(t,n,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),o(n),n.canvasList=[];for(var r=0;r<t.layers.length;r++)n.canvasList.push(i(t.layers[r],r,n.id));return n}function i(t,a,n){var r={};r.id=n+"."+a,r.type=e.MyLayer,g(t,r,["name","triggers","actions","tag","zIndex","animations","transition"]),o(r),r.w=t.info.width,r.h=t.info.height,r.x=t.info.left,r.y=t.info.top,r.subCanvasList=[];for(var i=0;i<t.subLayers.length;i++){var l=t.subLayers[i];t.showSubLayer.id==l&&(r.curSubCanvasIdx=i),r.subCanvasList.push(s(l,i,r.id))}return r}function s(t,a,n){var r={};r.id=n+"."+a,r.type=e.MySubLayer,g(t,r,["name","tag","actions","zIndex","backgroundImage","backgroundColor"]),o(r),r.widgetList=[];for(var i=0;i<t.widgets.length;i++){var s=t.widgets[i];r.widgetList.push(l(s,i,r.id))}return r}function l(e,t,a){var n={},r={};if(n=_.cloneDeep(e),o(n),"general"==n.type){var i=n.info,s=i.left,l=i.top,d=i.width,c=i.height;r=new WidgetModel.models.Button(s,l,d,c,"button",null,n.texList[0].slices),r=r.toObject(),r.generalType="Button",r.id=a+"."+t,r.type="widget",r.tag=e.tag,r.subType="general"}else{var i=n.info,s=i.left,l=i.top,d=i.width,c=i.height;switch(n.type){case"MyButton":r=new WidgetModel.models.Button(s,l,d,c,"button",null,n.texList[0].slices),r=r.toObject(),r.generalType="Button",r.mode=Number(e.buttonModeId),r.tag=_.cloneDeep(e.tag),r.subType="general",r.actions=n.actions;break;case"MyButtonGroup":var g=[];n.texList.map(function(e){g.push(e.slices[0]),g.push(e.slices[1])}),r=new WidgetModel.models.ButtonGroup(s,l,d,c,n.info.count||1,"horizontal"==n.info.arrange?0:1,n.info.interval||0,g),r=r.toObject(),r.tag=_.cloneDeep(e.tag),r.generalType="ButtonGroup",r.subType="general",r.actions=n.actions;break;case"MyDashboard":r=new WidgetModel.models.Dashboard(s,l,d,c,n.dashboardModeId,n.texList,n.info),r=r.toObject(),r.generalType="Dashboard",r.mode=Number(e.dashboardModeId),r.tag=_.cloneDeep(e.tag),r.subType="general";var u="minValue,maxValue,minAngle,maxAngle,lowAlarmValue,highAlarmValue";u.split(",").forEach(function(e){r[e]=i[e]||0}),r.otherAttrs[0]=i.offsetValue||0,r.otherAttrs[1]=Number(i.clockwise),r.actions=n.actions;break;case"MyRotateImg":r=new WidgetModel.models.RotateImg(s,l,d,c,n.texList[0].slices[0]),r=r.toObject(),r.generalType="RotateImg",r.tag=_.cloneDeep(e.tag),r.subType="general";var u="minValue,maxValue";u.split(",").forEach(function(e){r[e]=i[e]||0}),r.actions=n.actions;break;case"MyTextArea":var p={};"fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline".split(",").forEach(function(e){p[e]=i[e]}),r=new WidgetModel.models.TextArea(s,l,d,c,i.text,p,n.texList[0].slices[0]),r=r.toObject(),r.generalType="TextArea",r.tag=_.cloneDeep(e.tag),r.subType="general";break;default:n.subType=e.type,r=n}r.id=a+"."+t,r.type="widget"}return r}function d(e,t){for(var o=0;o<t.length;o++){c(e,t[o])}}function c(e,t){t in e&&(e[t]=WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(e[t]),!0).map(function(e){return e.cmd}))}function g(e,t,o){for(var a=0;a<o.length;a++){var n=o[a];"object"==typeof e[n]?t[n]=_.cloneDeep(e[n]):t[n]=e[n]}}this.transDataFile=n}]);