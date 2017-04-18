ideServices.service("ProjectTransformService",["Type",function(e){function t(e,t){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),t)}function n(e,n){if(n=n||!0,e&&e.actions&&e.actions.length)for(var o=0;o<e.actions.length;o++){var r=e.actions[o];r.commands=t(r.commands,n)}}function o(){var e=["onInitialize","onMouseUp","onMouseDown","onTagChange"],t={},n=WidgetModel.models,o=_.cloneDeep(WidgetCommands);console.log("models",n);for(var r in n)if(n.hasOwnProperty(r)){var a=_.cloneDeep(n[r].prototype.commands);l(a,e),t[r]=a}console.log("registered commands",t);var i={};for(var r in o)if(i[r]={},o.hasOwnProperty(r)){modelObj=o[r];for(var s=0;s<e.length;s++){var d=e[s];d in modelObj&&(modelObj[d]=ASTTransformer.transAST(widgetCompiler.parse(modelObj[d])),c(modelObj,d),i[r][d]=cppWidgetCommandTranslator.transJSWidgetCommands(modelObj[d]))}}return console.log("testModels",o),console.log("cppModels",i),{commands:o,cppModels:i}}function r(e){var t={};t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.size=e.currentSize;var n=o();t.generalWidgetCommands=n.commands,t.cppWidgetCommands=n.cppModels,t.pageList=[];for(var r=0;r<e.pages.length;r++)t.pageList.push(a(e.pages[r],r));return t}function a(t,o){var r={};r.id=""+o,r.type=e.MyPage,g(t,r,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),n(r),r.canvasList=[];for(var a=0;a<t.layers.length;a++)r.canvasList.push(i(t.layers[a],a,r.id));return r}function i(t,o,r){var a={};a.id=r+"."+o,a.type=e.MyLayer,g(t,a,["name","triggers","actions","tag","zIndex","animations","transition"]),n(a),a.w=t.info.width,a.h=t.info.height,a.x=t.info.left,a.y=t.info.top,a.subCanvasList=[];for(var i=0;i<t.subLayers.length;i++){var d=t.subLayers[i];t.showSubLayer.id==d&&(a.curSubCanvasIdx=i),a.subCanvasList.push(s(d,i,a.id))}return a}function s(t,o,r){var a={};a.id=r+"."+o,a.type=e.MySubLayer,g(t,a,["name","tag","actions","zIndex","backgroundImage","backgroundColor"]),n(a),a.widgetList=[];for(var i=0;i<t.widgets.length;i++){var s=t.widgets[i];a.widgetList.push(d(s,i,a.id))}return a}function d(e,t,o){var r={};if(r=_.cloneDeep(e),"general"==r.type){var a=r.info,i=a.left,s=a.top,d=a.width,l=a.height;r=new WidgetModel.models.Button(i,s,d,l,"button",null,r.texList[0].slices),r=r.toObject(),r.generalType="Button",r.id=o+"."+t,r.type="widget",r.tag=e.tag,r.subType="general"}else{var a=r.info,i=a.left,s=a.top,d=a.width,l=a.height;switch(r.type){case"MyButton":r=new WidgetModel.models.Button(i,s,d,l,"button",null,r.texList[0].slices),r=r.toObject(),r.generalType="Button",r.mode=Number(e.buttonModeId),r.tag=_.cloneDeep(e.tag),r.subType="general";break;case"MyButtonGroup":var c=[];r.texList.map(function(e){c.push(e.slices[0]),c.push(e.slices[1])}),r=new WidgetModel.models.ButtonGroup(i,s,d,l,r.info.count||1,"horizontal"==r.info.arrange?0:1,r.info.interval||0,c),r=r.toObject(),r.tag=_.cloneDeep(e.tag),r.generalType="ButtonGroup",r.subType="general";break;default:n(r),r.subType=e.type}r.id=o+"."+t,r.type="widget"}return r}function l(e,t){for(var n=0;n<t.length;n++){c(e,t[n])}}function c(e,t){t in e&&(e[t]=WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(e[t]),!0).map(function(e){return e.cmd}))}function g(e,t,n){for(var o=0;o<n.length;o++){var r=n[o];"object"==typeof e[r]?t[r]=_.cloneDeep(e[r]):t[r]=e[r]}}this.transDataFile=r}]);