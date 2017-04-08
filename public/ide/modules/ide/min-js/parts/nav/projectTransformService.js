ideServices.service("ProjectTransformService",["Type",function(e){function n(e,n){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),n)}function t(e,t){if(t=t||!0,e&&e.actions&&e.actions.length)for(var o=0;o<e.actions.length;o++){var r=e.actions[o];r.commands=n(r.commands,t)}}function o(){var e=["onInitialize","onMouseUp","onMouseDown","onTagChange"],n={},t=WidgetModel.models,o=_.cloneDeep(WidgetCommands);console.log("models",t);for(var r in t)if(t.hasOwnProperty(r)){var a=_.cloneDeep(t[r].prototype.commands);c(a,e),n[r]=a}console.log("registered commands",n),console.log(_.cloneDeep(o.Button));for(var r in o)if(o.hasOwnProperty(r)){r=o[r];for(var i=0;i<e.length;i++){var s=e[i];s in r&&(r[s]=ASTTransformer.transAST(widgetCompiler.parse(r[s])),u(r,s),console.log("testModelsButtonCommands1",_.cloneDeep(o)),r[s]=cppWidgetCommandTranslator.transJSWidgetCommands(r[s]),console.log("testModelsButtonCommands2",_.cloneDeep(o)))}}return console.log("commands",n),n}function r(e){var n={};n.version=e.version,n.name=e.name||"default project",n.author=e.author||"author",n.size=e.currentSize,n.generalWidgetCommands=o(),n.pageList=[];for(var t=0;t<e.pages.length;t++)n.pageList.push(a(e.pages[t],t));return n}function a(n,o){var r={};r.id=""+o,r.type=e.MyPage,d(n,r,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),t(r),r.canvasList=[];for(var a=0;a<n.layers.length;a++)r.canvasList.push(i(n.layers[a],a,r.id));return r}function i(n,o,r){var a={};a.id=r+"."+o,a.type=e.MyLayer,d(n,a,["name","triggers","actions","tag","zIndex","animations","transition"]),t(a),a.w=n.info.width,a.h=n.info.height,a.x=n.info.left,a.y=n.info.top,a.subCanvasList=[];for(var i=0;i<n.subLayers.length;i++){var l=n.subLayers[i];n.showSubLayer.id==l&&(a.curSubCanvasIdx=i),a.subCanvasList.push(s(l,i,a.id))}return a}function s(n,o,r){var a={};a.id=r+"."+o,a.type=e.MySubLayer,d(n,a,["name","tag","actions","zIndex","backgroundImage","backgroundColor"]),t(a),a.widgetList=[];for(var i=0;i<n.widgets.length;i++){var s=n.widgets[i];a.widgetList.push(l(s,i,a.id))}return a}function l(e,n,o){var r={};if(r=_.cloneDeep(e),"general"==r.type){var a=r.info,i=a.left,s=a.top,l=a.width,c=a.height;r=new WidgetModel.models.Button(i,s,l,c,"button",null,r.texList[0].slices),r=r.toObject(),r.generalType="Button",r.id=o+"."+n,r.type="widget",r.subType="general"}else{var a=r.info,i=a.left,s=a.top,l=a.width,c=a.height;switch(r.type){case"MyButton":r=new WidgetModel.models.Button(i,s,l,c,"button",null,r.texList[0].slices),r=r.toObject(),r.generalType="Button",r.mode=Number(e.buttonModeId),r.subType="general";break;case"MyButtonGroup":console.log(r);var u=[];r.texList.map(function(e){u.push(e.slices[0]),u.push(e.slices[1])}),r=new WidgetModel.models.ButtonGroup(i,s,l,c,r.info.count||1,"horizontal"==r.info.arrange?0:1,r.info.interval||0,u),r=r.toObject(),r.generalType="ButtonGroup",r.subType="general";break;default:t(r),r.subType=e.type}console.log(_.cloneDeep(r)),r.id=o+"."+n,r.type="widget"}return r}function c(e,n){for(var t=0;t<n.length;t++){var o=n[t];u(e,o)}}function u(e,n){n in e&&(e[n]=WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(e[n]),!0).map(function(e){return e.cmd}))}function d(e,n,t){for(var o=0;o<t.length;o++){var r=t[o];"object"==typeof e[r]?n[r]=_.cloneDeep(e[r]):n[r]=e[r]}}this.transDataFile=r}]);