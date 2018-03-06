ideServices.service("ProjectTransformService",["Type","ResourceService","TemplateProvider",function(e,t,r){function o(e){var t={};t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.size=e.currentSize;var r=a();t.generalWidgetCommands=r.commands,t.cppWidgetCommands=r.cppModels,t.lastSaveTimeStamp=e.lastSaveTimeStamp,t.lastSaveUUID=e.lastSaveUUID,t.pageList=[];for(var o=0;o<e.pages.length;o++)t.pageList.push(i(e.pages[o],o));return u(t),t}function a(){var e=["onInitialize","onDestroy","onMouseUp","onMouseDown","onTagChange","onMouseMove","onKeyBoardLeft","onKeyBoardRight","onKeyBoardOK","onAnimationFrame","onHighlightFrame"],t={},r=WidgetModel.models,o=_.cloneDeep(WidgetCommands);for(var a in r)if(r.hasOwnProperty(a)){var i=_.cloneDeep(r[a].prototype.commands);n(i,e),t[a]=i}var l={};for(var a in o)if(l[a]={},o.hasOwnProperty(a))for(var c=o[a],g=0;g<e.length;g++){var h=e[g];if(h in c){var d=widgetCompiler.parse(c[h]);c[h]=ASTTransformer.transAST(d),s(c,h),l[a][h]=cppWidgetCommandTranslator.transJSWidgetCommands(c[h])}}return console.log("testModels",o),console.log("cppModels",l),{commands:o,cppModels:l}}function n(e,t){for(var r=0;r<t.length;r++){s(e,t[r])}}function s(e,t){t in e&&(e[t]=WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(e[t]),!0).map(function(e){return e.cmd}))}function i(t,r){var o={};o.id=""+r,o.type=e.MyPage,p(t,o,["name","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),h(o),o.canvasList=[];for(var a=0;a<t.layers.length;a++)o.canvasList.push(l(t.layers[a],a,o.id));return o}function l(t,r,o){var a={};a.id=o+"."+r,a.type=e.MyLayer,p(t,a,["name","triggers","actions","tag","zIndex","animations","transition"]),h(a),a.w=t.info.width,a.h=t.info.height,a.x=t.info.left,a.y=t.info.top,a.subCanvasList=[];for(var n=0;n<t.subLayers.length;n++){var s=t.subLayers[n];t.showSubLayer.id==s&&(a.curSubCanvasIdx=n),a.subCanvasList.push(c(s,n,a.id))}return a}function c(t,r,o){var a={};a.id=o+"."+r,a.type=e.MySubLayer,p(t,a,["name","info","tag","actions","zIndex","backgroundImage","backgroundColor"]),h(a),a.widgetList=[];for(var n=0;n<t.widgets.length;n++){var s=t.widgets[n];a.widgetList.push(g(s,n,a.id))}return a}function g(e,r,o){var a={},n={};if(a=_.cloneDeep(e),h(a),"general"!=a.type){var s=a.info,i=a.texList,l=s.left,c=s.top,g=s.width,d=s.height,u=!1;switch(a.type){case"MyButton":u=!a.info.disableHighlight;var m={};for(var f in s)switch(f){case"fontItalic":m["font-style"]=s[f];break;case"fontBold":m["font-weight"]=s[f];break;case"fontSize":m["font-size"]=s[f];break;case"fontFamily":m["font-family"]=s[f];break;case"fontColor":m["font-color"]=s[f]}n=new WidgetModel.models.Button(l,c,g,d,"button",m,a.texList[0].slices,u),n=n.toObject(),n.generalType="Button",n.mode=Number(e.buttonModeId),n.tag=_.cloneDeep(e.tag),n.subType="general",n.actions=a.actions;break;case"MyButtonGroup":u=!s.disableHighlight;var p=[];i.map(function(e){e.slices.map(function(e){p.push(e)})}),n=new WidgetModel.models.ButtonGroup(l,c,g,d,s.count||1,"horizontal"===s.arrange?0:1,s.interval||0,p,u),n=n.toObject(),n.tag=_.cloneDeep(e.tag),n.generalType="ButtonGroup",n.subType="general",n.actions=a.actions,n.totalHLFrame=u?6:void 0,n.otherAttrs[0]=s.interval,n.otherAttrs[1]=s.count,n.otherAttrs[2]=1,n.otherAttrs[3]=1,n.otherAttrs[4]="horizontal"===s.arrange?0:1;break;case"MyDashboard":n=new WidgetModel.models.Dashboard(l,c,g,d,a.dashboardModeId,a.texList,a.info),n=n.toObject(),n.generalType="Dashboard",n.mode=Number(e.dashboardModeId),n.tag=_.cloneDeep(e.tag),n.subType="general";var y="minValue,maxValue,minAngle,maxAngle,lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){n[e]=s[e]||0}),s.enableAnimation&&(n.totalFrame=30),n.otherAttrs[0]=s.offsetValue||0,n.otherAttrs[1]=Number(s.clockwise),n.actions=a.actions;break;case"MyProgress":var p=[];a.texList.map(function(e){p.push(e.slices[0])}),n=new WidgetModel.models.Progress(l,c,g,d,a.info,p),n=n.toObject(),n.tag=_.cloneDeep(e.tag),n.mode=Number(e.info.progressModeId);var y="minValue,maxValue,lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){n[e]=s[e]||0}),s.enableAnimation&&(n.totalFrame=30),n.actions=a.actions,n.generalType="Progress",n.subType="general";var A;if(1==n.mode?(A=b(p[1].color),n.otherAttrs[0]=A.r,n.otherAttrs[1]=A.g,n.otherAttrs[2]=A.b,n.otherAttrs[3]=A.a,A=b(p[2].color),n.otherAttrs[4]=A.r,n.otherAttrs[5]=A.g,n.otherAttrs[6]=A.b,n.otherAttrs[7]=A.a):3==n.mode&&(n.otherAttrs[0]=a.info.thresholdModeId,n.otherAttrs[1]=a.info.threshold1,n.otherAttrs[2]=a.info.threshold2,A=b(p[1].color),n.otherAttrs[3]=A.r,n.otherAttrs[4]=A.g,n.otherAttrs[5]=A.b,n.otherAttrs[6]=A.a,A=b(p[2].color),n.otherAttrs[7]=A.a,n.otherAttrs[8]=A.g,n.otherAttrs[9]=A.b,n.otherAttrs[10]=A.a,2==a.info.thresholdModeId&&(A=b(p[3].color),n.otherAttrs[11]=A.a,n.otherAttrs[12]=A.g,n.otherAttrs[13]=A.b,n.otherAttrs[14]=A.a)),n.otherAttrs[19]=Number(e.info.cursor),"1"==e.info.cursor){var v=p[p.length-1].imgSrc;if(v){var w=t.getResourceFromCache(v);n.layers[2].width=w.width,n.layers[2].height=w.height,rawH=n.layers[0].height,yTemp=parseInt((rawH-w.height)/2),n.layers[2].y=yTemp}}break;case"MyRotateImg":n=new WidgetModel.models.RotateImg(l,c,g,d,a.texList[0].slices[0]),n=n.toObject(),n.generalType="RotateImg",n.tag=_.cloneDeep(e.tag),n.subType="general";var y="minValue,maxValue";y.split(",").forEach(function(e){n[e]=s[e]||0}),n.actions=a.actions;break;case"MyTextArea":var m={};"fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline".split(",").forEach(function(e){m[e]=s[e]}),n=new WidgetModel.models.TextArea(l,c,g,d,s.text,m,a.texList[0].slices[0]),n=n.toObject(),n.generalType="TextArea",n.tag=_.cloneDeep(e.tag),n.subType="general";break;case"MySwitch":var p=[];a.texList.map(function(e){p.push(e.slices[0])}),n=new WidgetModel.models.Switch(l,c,g,d,a.info,p),n=n.toObject(),n.tag=_.cloneDeep(e.tag),n.generalType="Switch",n.subType="general",n.otherAttrs[0]=Number(a.info.bindBit);break;case"MyScriptTrigger":n=new WidgetModel.models.ScriptTrigger(l,c,g,d),n=n.toObject(),n.generalType="ScriptTrigger",n.tag=_.cloneDeep(e.tag),n.subType="general";var y="lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){n[e]=s[e]||0}),n.minValue=n.lowAlarmValue-1,n.maxValue=n.highAlarmValue+1,n.actions=a.actions;break;case"MyVideo":n=new WidgetModel.models.Video(l,c,g,d,a.texList[0].slices[0]),n=n.toObject(),n.generalType="Video","HDMI"==s.scource?n.mode=0:n.mode=1,n.tag=_.cloneDeep(e.tag),n.subType="general";break;case"MySlide":n=new WidgetModel.models.Slide(l,c,g,d,a.info,_.cloneDeep(a.texList[0].slices)),n=n.toObject(),n.generalType="Slide",n.tag=_.cloneDeep(e.tag),n.subType="general",n.actions=a.actions;break;case"MySlideBlock":var v=a.texList[1].slices[0].imgSrc,T={w:0,h:0};if(v){var D=t.getResourceFromCache(v);D&&(T.w=D.width,T.h=D.height)}n=new WidgetModel.models.SlideBlock(l,c,g,d,s.arrange,T,[a.texList[0].slices[0],a.texList[1].slices[0]]),n=n.toObject(),n.generalType="SlideBlock",n.tag=_.cloneDeep(e.tag);var y="minValue,maxValue,lowAlarmValue,highAlarmValue";y.split(",").forEach(function(e){n[e]=s[e]||0}),n.arrange="horizontal"==s.arrange?0:1,n.otherAttrs[0]=0,n.otherAttrs[1]=0,n.otherAttrs[2]=T.w,n.otherAttrs[3]=T.h,n.otherAttrs[4]=0,n.otherAttrs[5]=0,n.otherAttrs[6]=0,n.subType="general",n.actions=a.actions;break;case"MyNum":var m={};for(var f in s)switch(f){case"fontItalic":m["font-style"]=s[f];break;case"fontBold":m["font-weight"]=s[f];break;case"fontSize":m["font-size"]=s[f];break;case"fontFamily":m["font-family"]=s[f];break;case"fontColor":m["font-color"]=s[f]}n=new WidgetModel.models.Num(l,c,g,d,s,m),n=n.toObject();var y="minValue,maxValue,lowAlarmValue,highAlarmValue";switch(y.split(",").forEach(function(e){n[e]=s[e]||0}),n.mode=Number(s.numModeId),n.otherAttrs[0]=Number("NO"!=s.noInit),n.otherAttrs[1]=Number(s.frontZeroMode),n.otherAttrs[2]=Number(s.symbolMode),n.otherAttrs[3]=s.decimalCount,n.otherAttrs[4]=s.numOfDigits,n.otherAttrs[5]=Number(s.overFlowStyle),n.otherAttrs[6]=Number(s.maxFontWidth),s.align){case"left":n.otherAttrs[7]=0;break;case"center":n.otherAttrs[7]=1;break;case"right":n.otherAttrs[7]=2;break;default:n.otherAttrs[7]=1}n.otherAttrs[8]=Number(s.width),n.generalType="Num",n.tag=_.cloneDeep(e.tag),n.subType="general",n.actions=a.actions;break;case"MyTexNum":n=new WidgetModel.models.TexNum(l,c,g,d,s,a.texList[0].slices),n=n.toObject();var y="minValue,maxValue,lowAlarmValue,highAlarmValue";switch(y.split(",").forEach(function(e){n[e]=s[e]||0}),n.mode=Number(s.numModeId),n.otherAttrs[0]=Number(s.numValue),n.otherAttrs[1]=Number(s.frontZeroMode),n.otherAttrs[2]=Number(s.symbolMode),n.otherAttrs[3]=Number(s.decimalCount),n.otherAttrs[4]=Number(s.numOfDigits),n.otherAttrs[5]=Number(s.overFlowStyle),n.otherAttrs[6]=Number(s.characterW),n.otherAttrs[7]=Number(s.characterH),n.otherAttrs[8]=Number(s.width),s.align){case"left":n.otherAttrs[9]=0;break;case"center":n.otherAttrs[9]=1;break;case"right":n.otherAttrs[9]=2;break;default:n.otherAttrs[9]=1}n.generalType="TexNum",n.tag=_.cloneDeep(e.tag),n.subType="general",n.actions=a.actions,console.log("texnum",n);break;case"MyRotaryKnob":n=new WidgetModel.models.RotaryKnob(l,c,g,d,s,a.texList),n=n.toObject();var y="minValue,maxValue";y.split(",").forEach(function(e){n[e]=s[e]||0}),n.otherAttrs[1]=0,n.otherAttrs[2]=g/2,n.otherAttrs[3]=d/2,n.otherAttrs[4]=0,n.otherAttrs[5]=0,n.otherAttrs[6]=0,n.generalType="RotaryKnob",n.tag=_.cloneDeep(e.tag),n.subType="general",n.actions=a.actions;break;case"MySelector":for(var I=a.texList[1].slices,N=[],L=0,W=I.length;L<W;L++)N[L]={},N[L].color=I[L].color,N[L].text=I[L].text,N[L].img=t.getResourceFromCache(I[L].imgSrc);I=a.texList[2].slices;for(var C=[],L=0,W=I.length;L<W;L++)C[L]={},C[L].color=I[L].color,C[L].text=I[L].text,C[L].img=t.getResourceFromCache(I[L].imgSrc);var V=s.itemFont.fontItalic+" "+s.itemFont.fontBold+" "+s.itemFont.fontSize+'px "'+s.itemFont.fontFamily+'"',F=s.selectorFont.fontItalic+" "+s.selectorFont.fontBold+" "+s.selectorFont.fontSize+'px "'+s.selectorFont.fontFamily+'"',O=x(s.selectorWidth,s.selectorHeight*s.itemCount,s.selectorHeight,C,F,s.selectorFont.fontColor),j=x(s.itemWidth,s.itemHeight*s.itemCount,s.itemHeight,N,V,s.itemFont.fontColor),z="selector"+(++k).toString()+".png",B="selector"+(++k).toString()+".png",R={id:z,name:"selectedImg",type:"image/png",src:O.src},H={id:B,name:"unSelectedImg",type:"image/png",src:j.src},P=function(e,t){"error"===e.type?(toastr.warning("资源加载失败: "+t.name),t.complete=!1):t.complete=!0}.bind(this);M("selector001")||t.cacheFile(R,globalResources,null,P),M("selector002")||t.cacheFile(H,globalResources,null,P);var E="/"+z;S(z,E);var U="/"+B;S(B,U),n=new WidgetModel.models.Selector(l,c,g,d,s,a.texList[0].slices[0],U,E,a.texList[3].slices[0]),n=n.toObject(),n.otherAttrs[1]=Number(s.curValue),n.otherAttrs[2]=Number(s.itemCount),n.otherAttrs[3]=Number(s.itemShowCount),n.otherAttrs[4]=Number(s.width),n.otherAttrs[5]=Number(s.height),n.otherAttrs[6]=Number(s.itemWidth),n.otherAttrs[7]=Number(s.itemHeight),n.otherAttrs[8]=Number(s.selectorWidth),n.otherAttrs[9]=Number(s.selectorHeight),n.otherAttrs[10]=0,n.otherAttrs[11]=l,n.otherAttrs[12]=c,n.otherAttrs[13]=0,n.otherAttrs[14]=0,n.otherAttrs[15]=0,n.generalType="Selector",n.tag=_.cloneDeep(e.tag),n.subType="general",n.actions=a.actions;break;case"MyTexTime":n=new WidgetModel.models.TexTime(l,c,g,d,s,i[0].slices,i[1].slices[0]),n=n.toObject();var K=0;switch(s.dateTimeModeId){case"0":K=6,n.tag=_.cloneDeep(e.tag)||"时钟变量时分秒";break;case"1":K=4,n.tag=_.cloneDeep(e.tag)||"时钟变量时分秒";break;case"2":case"3":K=8,n.tag=_.cloneDeep(e.tag)||"时钟变量年月日"}n.otherAttrs[1]=0,n.otherAttrs[2]=K,n.otherAttrs[3]=Number(s.dateTimeModeId),n.otherAttrs[4]=Number(s.characterW),n.generalType="TexTime",n.subType="general",n.actions=a.actions;break;case"MyDateTime":var m={},G=0;for(var f in s)switch(f){case"fontItalic":m["font-style"]=s[f];break;case"fontBold":m["font-weight"]=s[f];break;case"fontSize":m["font-size"]=s[f];break;case"fontFamily":m["font-family"]=s[f];break;case"fontColor":m["font-color"]=s[f]}switch(n=new WidgetModel.models.DateTime(l,c,g,d,a.info,m,a.texList[0].slices[0]),n=n.toObject(),n.generalType="DateTime",n.subType="general",n.actions=a.actions,n.mode=a.info.dateTimeModeId,"0"==n.mode||"1"==n.mode?n.tag=_.cloneDeep(e.tag)||"时钟变量时分秒":n.tag=_.cloneDeep(e.tag)||"时钟变量年月日",Number(a.info.dateTimeModeId)){case 0:G=8;break;case 1:G=5;break;case 2:case 3:G=10;break;default:G=8}n.otherAttrs[0]=G,n.otherAttrs[1]=0;break;default:a.subType=e.type,n=a}n.id=o+"."+r,n.type="widget"}else{var s=a.info,l=s.left,c=s.top,g=s.width,d=s.height;n=new WidgetModel.models.Button(l,c,g,d,"button",null,a.texList[0].slices),n=n.toObject(),n.generalType="Button",n.id=o+"."+r,n.type="widget",n.tag=e.tag,n.subType="general"}return n}function h(e,t){if(t=t||!0,e&&e.actions&&e.actions.length)for(var r=0;r<e.actions.length;r++){var o=e.actions[r];o.commands=d(o.commands,t)}}function d(e,t){return actionCompiler.transformer.trans(actionCompiler.parser.parse(e),t)}function u(e){var t=m(e.size.width,e.size.height),r=f();e.systemWidgets=[],e.systemWidgets.push(t),e.systemWidgets.push(r)}function m(e,t){var o=r.getSysColorPicker(),a=o.info,n=[];o.texList.map(function(e){e.slices.map(function(e){n.push(e)})});var s=new WidgetModel.models.ColorPicker(a.left,a.top,a.width,a.height,n);return s=s.toObject(),s.generalType=o.generalType,s.type="widget",s.subType="general",s}function f(){var t=r.getSystemTexDatePicker(),o=t.info,a=t.texList||[],n=new WidgetModel.models.TexDatePicker(o.left,o.top,o.width,o.height,o,a);return n=n.toObject(),n.generalType=e.SysTexDatePicker,n.type="widget",n.subType="general",n.otherAttrs[0]=2018,n.otherAttrs[1]=1,n.otherAttrs[2]=7,n.otherAttrs[3]=31,n.otherAttrs[4]=o.buttonSize,n.otherAttrs[5]=o.paddingX,n.otherAttrs[6]=o.paddingX+7*o.dayW,n.otherAttrs[7]=o.paddingY,n.otherAttrs[8]=o.paddingY+6*o.dayH,n.otherAttrs[9]=o.dayW,n.otherAttrs[10]=o.dayH,n.otherAttrs[11]=31,n.otherAttrs[12]=1,n}function p(e,t,r){for(var o=0;o<r.length;o++){var a=r[o];"object"==typeof e[a]?t[a]=_.cloneDeep(e[a]):t[a]=e[a]}}function b(e){var t=[],r={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),r={r:t[0],g:t[1],b:t[2],a:255*t[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);t=e.split(/[\(|\)]/)[1].split(","),r={r:t[0],g:t[1],b:t[2],a:255}}return r}function y(e){var t={};t.DSFlag="base",t.projectId=e.projectId,t.version=e.version,t.name=e.name||"default project",t.author=e.author||"author",t.CANId=e.CANId,t.lastSaveTimeStamp=e.lastSaveTimeStamp,t.lastSaveUUID=e.lastSaveUUID,t.size=e.currentSize;var r=e.pages;t.pages=[];for(var o=0;o<r.length;o++)t.pages.push(A(r[o]));return t}function A(e){var t={};p(e,t,["id","name","url","type","mode","selected","expand","current","currentFablayer","backgroundImage","backgroundColor","triggers","actions","tag","transition"]),h(t);var r=e.layers;t.layers=[];for(var o=0;o<r.length;o++)t.layers.push(v(r[o]));return t}function v(e){var t={};p(e,t,["id","name","url","type","zIndex","info","selected","current","expand","actions","animations","transition"]),t.w=e.info.width,t.h=e.info.height,t.x=e.info.left,t.y=e.info.top;var r=e.subLayers;t.subLayers=[];for(var o=0;o<r.length;o++){var a=r[o];e.showSubLayer.id==a&&(t.curSubCanvasIdx=o),t.subLayers.push(w(a))}return t}function w(e){var t={};console.log(e),p(e,t,["id","name","info","url","type","selected","expand","current","tag","actions","zIndex","backgroundImage","backgroundColor"]);var r=e.widgets;t.widgets=[];for(var o=0;o<r.length;o++){var a=r[o];t.widgets.push(T(a))}return t}function T(e){return _.cloneDeep(e)}function x(e,t,r,o,a,n){var s=document.createElement("canvas");s.width=e,s.height=t;for(var i=s.getContext("2d"),l=0;l<o.length;l++)o[l].color&&(i.fillStyle=o[l].color,i.fillRect(0,r*l,e,r)),o[l].img&&i.drawImage(o[l].img,0,r*l,e,r),o[l].text&&(i.font=a,i.fillStyle=n,i.textAlign="center",i.textBaseline="middle",i.fillText(o[l].text,e/2,r*l+r/2));var c=new Image;return c.src=s.toDataURL("image/png"),c}function M(e){for(var t=0;t<globalResources.length;t++)if(e===globalResources[t].id)return!0;return!1}function S(e,t){for(var r=0;r<globalResources.length;r++)if(e===globalResources[r].id)return globalResources[r].src=t,!0;return!1}this.transDataFile=o;var k=0;this.transDateFileBase=y}]);