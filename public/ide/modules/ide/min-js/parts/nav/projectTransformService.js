ideServices.service("ProjectTransformService",["Type","ResourceService",function(e,t){function r(e,t){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),t)}function o(e,t){if(t=t||!0,e&&e.actions&&e.actions.length)for(var o=0;o<e.actions.length;o++){var a=e.actions[o];a.commands=r(a.commands,t)}}function a(){var e=["onInitialize","onDestroy","onMouseUp","onMouseDown","onTagChange","onMouseMove","onKeyBoardLeft","onKeyBoardRight","onKeyBoardOK","onAnimationFrame"],t={},r=WidgetModel.models,o=_.cloneDeep(WidgetCommands);console.log("models",r);for(var a in r)if(r.hasOwnProperty(a)){var n=_.cloneDeep(r[a].prototype.commands);d(n,e),t[a]=n}console.log("registered commands",t);var s={};for(var a in o)if(s[a]={},o.hasOwnProperty(a)){modelObj=o[a];for(var i=0;i<e.length;i++){var l=e[i];if(l in modelObj){var c=widgetCompiler.parse(modelObj[l]);console.log(c),modelObj[l]=ASTTransformer.transAST(c),g(modelObj,l),s[a][l]=cppWidgetCommandTranslator.transJSWidgetCommands(modelObj[l])}}}return console.log("testModels",o),console.log("cppModels",s),{commands:o,cppModels:s}}function n(e){var t={};t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.size=e.currentSize;var r=a();t.generalWidgetCommands=r.commands,t.cppWidgetCommands=r.cppModels,t.lastSaveTimeStamp=e.lastSaveTimeStamp,t.lastSaveUUID=e.lastSaveUUID,t.pageList=[];for(var o=0;o<e.pages.length;o++)t.pageList.push(s(e.pages[o],o));return t}function s(t,r){var a={};a.id=""+r,a.type=e.MyPage,u(t,a,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),o(a),a.canvasList=[];for(var n=0;n<t.layers.length;n++)a.canvasList.push(i(t.layers[n],n,a.id));return a}function i(t,r,a){var n={};n.id=a+"."+r,n.type=e.MyLayer,u(t,n,["name","triggers","actions","tag","zIndex","animations","transition"]),o(n),n.w=t.info.width,n.h=t.info.height,n.x=t.info.left,n.y=t.info.top,n.subCanvasList=[];for(var s=0;s<t.subLayers.length;s++){var i=t.subLayers[s];t.showSubLayer.id==i&&(n.curSubCanvasIdx=s),n.subCanvasList.push(l(i,s,n.id))}return n}function l(t,r,a){var n={};n.id=a+"."+r,n.type=e.MySubLayer,u(t,n,["name","tag","actions","zIndex","backgroundImage","backgroundColor"]),o(n),n.widgetList=[];for(var s=0;s<t.widgets.length;s++){var i=t.widgets[s];n.widgetList.push(c(i,s,n.id))}return n}function c(e,r,a){var n={},s={};if(n=_.cloneDeep(e),o(n),"general"==n.type){var i=n.info,l=i.left,c=i.top,d=i.width,g=i.height;s=new WidgetModel.models.Button(l,c,d,g,"button",null,n.texList[0].slices),s=s.toObject(),s.generalType="Button",s.id=a+"."+r,s.type="widget",s.tag=e.tag,s.subType="general"}else{var i=n.info,l=i.left,c=i.top,d=i.width,g=i.height,u=!1;switch(n.type){case"MyButton":u=!n.info.disableHighlight,s=new WidgetModel.models.Button(l,c,d,g,"button",null,n.texList[0].slices,u),s=s.toObject(),s.generalType="Button",s.mode=Number(e.buttonModeId),s.tag=_.cloneDeep(e.tag),s.subType="general",s.actions=n.actions;break;case"MyButtonGroup":u=!n.info.disableHighlight;var m,p=[];if(u)for(var f=n.texList[n.texList.length-1].slices[0],b=0;b<n.info.count;b++)m=n.texList[b],p.push(m.slices[0]),p.push(m.slices[1]),p.push(f);else for(var b=0;b<n.info.count;b++)m=n.texList[b],p.push(m.slices[0]),p.push(m.slices[1]);s=new WidgetModel.models.ButtonGroup(l,c,d,g,n.info.count||1,"horizontal"==n.info.arrange?0:1,n.info.interval||0,p,u),s=s.toObject(),s.tag=_.cloneDeep(e.tag),s.generalType="ButtonGroup",s.subType="general",s.actions=n.actions;break;case"MyDashboard":s=new WidgetModel.models.Dashboard(l,c,d,g,n.dashboardModeId,n.texList,n.info),s=s.toObject(),s.generalType="Dashboard",s.mode=Number(e.dashboardModeId),s.tag=_.cloneDeep(e.tag),s.subType="general";var y="minValue,maxValue,minAngle,maxAngle,lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){s[e]=i[e]||0}),console.log("enableAnimation",i.enableAnimation),i.enableAnimation&&(s.totalFrame=30),s.otherAttrs[0]=i.offsetValue||0,s.otherAttrs[1]=Number(i.clockwise),s.actions=n.actions;break;case"MyProgress":var p=[];n.texList.map(function(e){p.push(e.slices[0])}),s=new WidgetModel.models.Progress(l,c,d,g,n.info,p),s=s.toObject(),s.tag=_.cloneDeep(e.tag),s.mode=Number(e.info.progressModeId);var y="minValue,maxValue,lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){s[e]=i[e]||0}),console.log("progress",i.enableAnimation),i.enableAnimation&&(s.totalFrame=30),s.actions=n.actions,s.generalType="Progress",s.subType="general";var v;if(1==s.mode?(v=h(p[1].color),s.otherAttrs[0]=v.r,s.otherAttrs[1]=v.g,s.otherAttrs[2]=v.b,s.otherAttrs[3]=v.a,v=h(p[2].color),s.otherAttrs[4]=v.r,s.otherAttrs[5]=v.g,s.otherAttrs[6]=v.b,s.otherAttrs[7]=v.a):3==s.mode&&(s.otherAttrs[0]=n.info.thresholdModeId,s.otherAttrs[1]=n.info.threshold1,s.otherAttrs[2]=n.info.threshold2,v=h(p[1].color),s.otherAttrs[3]=v.r,s.otherAttrs[4]=v.g,s.otherAttrs[5]=v.b,s.otherAttrs[6]=v.a,v=h(p[2].color),s.otherAttrs[7]=v.a,s.otherAttrs[8]=v.g,s.otherAttrs[9]=v.b,s.otherAttrs[10]=v.a,2==n.info.thresholdModeId&&(v=h(p[3].color),s.otherAttrs[11]=v.a,s.otherAttrs[12]=v.g,s.otherAttrs[13]=v.b,s.otherAttrs[14]=v.a)),s.otherAttrs[19]=Number(e.info.cursor),"1"==e.info.cursor){var A=p[p.length-1].imgSrc;if(A){var w=t.getResourceFromCache(A);s.layers[2].width=w.width,s.layers[2].height=w.height,rawH=s.layers[0].height,yTemp=parseInt((rawH-w.height)/2),s.layers[2].y=yTemp}}break;case"MyRotateImg":s=new WidgetModel.models.RotateImg(l,c,d,g,n.texList[0].slices[0]),s=s.toObject(),s.generalType="RotateImg",s.tag=_.cloneDeep(e.tag),s.subType="general";var y="minValue,maxValue";y.split(",").forEach(function(e){s[e]=i[e]||0}),s.actions=n.actions;break;case"MyTextArea":var M="fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline",T={};M.split(",").forEach(function(e){T[e]=i[e]}),s=new WidgetModel.models.TextArea(l,c,d,g,i.text,T,n.texList[0].slices[0]),s=s.toObject(),s.generalType="TextArea",s.tag=_.cloneDeep(e.tag),s.subType="general";break;case"MySwitch":var p=[];n.texList.map(function(e){p.push(e.slices[0])}),s=new WidgetModel.models.Switch(l,c,d,g,n.info,p),s=s.toObject(),s.tag=_.cloneDeep(e.tag),s.generalType="Switch",s.subType="general",s.otherAttrs[0]=Number(n.info.bindBit);break;case"MyScriptTrigger":s=new WidgetModel.models.ScriptTrigger(l,c,d,g),s=s.toObject(),s.generalType="ScriptTrigger",s.tag=_.cloneDeep(e.tag),s.subType="general";var y="lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){s[e]=i[e]||0});break;case"MyVideo":s=new WidgetModel.models.Video(l,c,d,g,n.texList[0].slices[0]),s=s.toObject(),s.generalType="Video","HDMI"==i.scource?s.mode=0:s.mode=1,s.tag=_.cloneDeep(e.tag),s.subType="general";break;case"MySlide":s=new WidgetModel.models.Slide(l,c,d,g,n.info,_.cloneDeep(n.texList[0].slices)),s=s.toObject(),s.generalType="Slide",s.tag=_.cloneDeep(e.tag),s.subType="general",s.actions=n.actions;break;case"MySlideBlock":var A=n.texList[1].slices[0].imgSrc,S={w:0,h:0};if(A){var x=t.getResourceFromCache(A);x&&(S.w=x.width,S.h=x.height)}s=new WidgetModel.models.SlideBlock(l,c,d,g,i.arrange,S,[n.texList[0].slices[0],n.texList[1].slices[0]]),s=s.toObject(),s.generalType="SlideBlock",s.tag=_.cloneDeep(e.tag);var y="minValue,maxValue,lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){s[e]=i[e]||0}),s.arrange="horizontal"==i.arrange?0:1,console.log(s,n),s.otherAttrs[0]=0,s.otherAttrs[1]=0,s.otherAttrs[2]=S.w,s.otherAttrs[3]=S.h,s.otherAttrs[4]=0,s.otherAttrs[5]=0,s.otherAttrs[6]=0,s.subType="general",s.actions=n.actions;break;case"MyNum":var M="fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline",T={};M.split(",").forEach(function(e){T[e]=i[e]}),s=new WidgetModel.models.Num(l,c,d,g,i,T),s=s.toObject();var y="minValue,maxValue,lowAlarmValue,highAlarmValue";switch(y.split(",").forEach(function(e){s[e]=i[e]||0}),s.mode=Number(i.numModeId),s.otherAttrs[0]=Number("NO"!=i.noInit),s.otherAttrs[1]=Number(i.frontZeroMode),s.otherAttrs[2]=Number(i.symbolMode),s.otherAttrs[3]=i.decimalCount,s.otherAttrs[4]=i.numOfDigits,s.otherAttrs[5]=Number(i.overFlowStyle),s.otherAttrs[6]=Number(i.maxFontWidth),i.align){case"left":s.otherAttrs[7]=0;break;case"center":s.otherAttrs[7]=1;break;case"right":s.otherAttrs[7]=2;break;default:s.otherAttrs[7]=1}s.generalType="Num",s.tag=_.cloneDeep(e.tag),s.subType="general",s.actions=n.actions,console.log(s);break;case"MyDateTime":var M="fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline",T={},D=0;switch(M.split(",").forEach(function(e){T[e]=i[e]}),s=new WidgetModel.models.DateTime(l,c,d,g,n.info,T,n.texList[0].slices[0]),s=s.toObject(),s.generalType="DateTime",s.subType="general",s.actions=n.actions,s.mode=n.info.dateTimeModeId,"0"==s.mode||"1"==s.mode?s.tag=_.cloneDeep(e.tag)||"时钟变量时分秒":s.tag=_.cloneDeep(e.tag)||"时钟变量年月日",Number(n.info.dateTimeModeId)){case 0:D=8;break;case 1:D=5;break;case 2:case 3:D=10;break;default:D=8}s.otherAttrs[0]=D,s.otherAttrs[1]=0;break;default:n.subType=e.type,s=n}s.id=a+"."+r,s.type="widget"}return s}function d(e,t){for(var r=0;r<t.length;r++){g(e,t[r])}}function g(e,t){t in e&&(e[t]=WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(e[t]),!0).map(function(e){return e.cmd}))}function u(e,t,r){for(var o=0;o<r.length;o++){var a=r[o];"object"==typeof e[a]?t[a]=_.cloneDeep(e[a]):t[a]=e[a]}}function h(e){var t=[],r={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),r={r:t[0],g:t[1],b:t[2],a:255*t[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);t=e.split(/[\(|\)]/)[1].split(","),r={r:t[0],g:t[1],b:t[2],a:255}}return r}function m(e){var t={};t.DSFlag="base",t.projectId=e.projectId,t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.CANId=e.CANId,t.lastSaveTimeStamp=e.lastSaveTimeStamp,t.lastSaveUUID=e.lastSaveUUID,t.size=e.currentSize;var r=e.pages;t.pages=[];for(var o=0;o<r.length;o++)t.pages.push(p(r[o]));return t}function p(e){var t={};u(e,t,["id","name","url","type","mode","selected","expand","current","currentFablayer","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),o(t);var r=e.layers;t.layers=[];for(var a=0;a<r.length;a++)t.layers.push(f(r[a]));return t}function f(e){var t={};u(e,t,["id","name","url","type","zIndex","info","selected","current","expand","actions","animations","transition"]),t.w=e.info.width,t.h=e.info.height,t.x=e.info.left,t.y=e.info.top;var r=e.subLayers;t.subLayers=[];for(var o=0;o<r.length;o++){var a=r[o];e.showSubLayer.id==a&&(t.curSubCanvasIdx=o),t.subLayers.push(b(a))}return t}function b(e){var t={};u(e,t,["id","name","url","type","selected","expand","current","tag","actions","zIndex","backgroundImage","backgroundColor"]);var r=e.widgets;t.widgets=[];for(var o=0;o<r.length;o++){var a=r[o];t.widgets.push(y(a))}return t}function y(e){return _.cloneDeep(e)}this.transDataFile=n,this.transDateFileBase=m}]);