ideServices.service("ProjectTransformService",["Type",function(e){function t(e,t){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),t)}function n(e,n){if(n=n||!0,e&&e.actions&&e.actions.length)for(var o=0;o<e.actions.length;o++){var r=e.actions[o];r.commands=t(r.commands,n)}}function o(){var e=["onInitialize","onMouseUp","onMouseDown","onTagChange"],t={},n=WidgetModel.models,o=WidgetCommands;console.log("models",n);for(var r in n)if(n.hasOwnProperty(r)){var a=_.cloneDeep(n[r].prototype.commands);u(a,e),t[r]=a}return console.log("registered commands",t),console.log(_.cloneDeep(o.Button)),o.Button.onInitialize=ASTTransformer.transAST(widgetCompiler.parse(o.Button.onInitialize)),console.log(o),u(o.Button,e),console.log("testModelsButtonCommands",o),t}function r(e){var t={};t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.size=e.currentSize,t.generalWidgetCommands=o(),t.pageList=[];for(var n=0;n<e.pages.length;n++)t.pageList.push(a(e.pages[n],n));return t}function a(t,o){var r={};r.id=""+o,r.type=e.MyPage,d(t,r,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),n(r),r.canvasList=[];for(var a=0;a<t.layers.length;a++)r.canvasList.push(i(t.layers[a],a,r.id));return r}function i(t,o,r){var a={};a.id=r+"."+o,a.type=e.MyLayer,d(t,a,["name","triggers","actions","tag","zIndex","animations","transition"]),n(a),a.w=t.info.width,a.h=t.info.height,a.x=t.info.left,a.y=t.info.top,a.subCanvasList=[];for(var i=0;i<t.subLayers.length;i++){var l=t.subLayers[i];t.showSubLayer.id==l&&(a.curSubCanvasIdx=i),a.subCanvasList.push(s(l,i,a.id))}return a}function s(t,o,r){var a={};a.id=r+"."+o,a.type=e.MySubLayer,d(t,a,["name","tag","actions","zIndex","backgroundImage","backgroundColor"]),n(a),a.widgetList=[];for(var i=0;i<t.widgets.length;i++){var s=t.widgets[i];a.widgetList.push(l(s,i,a.id))}return a}function l(e,t,o){var r={};if(r=_.cloneDeep(e),"general"==r.type){var a=r.info,i=a.left,s=a.top,l=a.width,u=a.height;r=new WidgetModel.models.Button(i,s,l,u,"button",null,r.texList[0].slices),r=r.toObject(),r.generalType="Button",r.id=o+"."+t,r.type="widget",r.subType="general"}else{var a=r.info,i=a.left,s=a.top,l=a.width,u=a.height;switch(r.type){case"MyButton":r=new WidgetModel.models.Button(i,s,l,u,"button",null,r.texList[0].slices),r=r.toObject(),r.generalType="Button",r.mode=Number(e.buttonModeId),r.subType="general";break;case"MyButtonGroup":console.log(r);var c=[];r.texList.map(function(e){c.push(e.slices[0]),c.push(e.slices[1])}),r=new WidgetModel.models.ButtonGroup(i,s,l,u,r.info.count||1,"horizontal"==r.info.arrange?0:1,r.info.interval||0,c),r=r.toObject(),r.generalType="ButtonGroup",r.subType="general";break;default:n(r),r.subType=e.type}console.log(_.cloneDeep(r)),r.id=o+"."+t,r.type="widget"}return r}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];c(e,o)}}function c(e,t){t in e&&(e[t]=WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(e[t]),!0).map(function(e){return e.cmd}))}function d(e,t,n){for(var o=0;o<n.length;o++){var r=n[o];"object"==typeof e[r]?t[r]=_.cloneDeep(e[r]):t[r]=e[r]}}this.transDataFile=r}]);