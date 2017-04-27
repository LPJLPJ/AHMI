!function(e){"function"==typeof define&&define.amd?define("cppWidgetCommandTranslator",[],e):"object"==typeof module&&module.exports?module.exports=e():window.cppWidgetCommandTranslator=e()}(function(){function e(e,n,a){this.name=e||"",this.bytes=n||4,this.index=a||0}function n(e,n){this.bytes=e,this.reserve=n||!1}function a(e){this.op=e,this.operands=[].slice.call(arguments,1),this.index=0}function w(e,n){this.type=e,this.value=n,this.aVals=[].slice.call(arguments,2)}function O(e){return/^[0-9]+$/.test(e)}function T(e){var n=e.value.split(".");if(2==n.length&&"this"==n[0])return new w("widget",d[n[1]]);if(3==n.length){if("this"==n[0]&&"info"==n[1])return new w("widget",d.info[n[2]]);if("this"==n[0]&&"layers"==n[1]&&"length"==n[2])return new w("widget",d.numOfLayers);if("this"==n[0]&&"otherAttrs"==n[1]&&O(n[2]))return new w("widget","a"+(m.length+Number(n[2])))}if(4==n.length&&"this"==n[0]&&"layers"==n[1])return O(n[2])?new w("layer",h[n[3]],Number(n[2]),"IMM"):new w("layer",h[n[3]],n[2],"ID");if(6==n.length&&"this"==n[0]&&"layers"==n[1]&&"subLayers"==n[3])return O(n[2])?new w("subLayer",p[n[4]],n[5],Number(n[2]),"IMM"):new w("subLayer",p[n[4]],n[5],n[2],"ID");throw new Error("unsupported exp "+e.value)}function l(e){return D[e]}function t(e){return G[e]||console.log("unsupported attr",e),G[e].index}function r(e){return y[e].index}function E(e){return F[e].index}function P(e,n){switch(e){case"SubLayerClassROI":return b[n].index;case"SubLayerClassImage":return U[n].index;case"SubLayerClassFont":return V[n].index;case"SubLayerClassColor":return x[n].index}}function u(e){var n,a,w=e[0];switch(w){case"temp":n=["OPSETTEMP",l(e[1]),e[2].value];break;case"set":var O=e[1],u=e[2];if("ID"==O.type){if("Int"==u.type)n=["OPSETTEMP",l(e[1].value),e[2].value];else if("ID"==u.type)n=["OPGETTEMP",l(e[1].value),l(e[2].value)];else if("EXP"==u.type){if(!(a=T(u)))throw console.log(u),new Error("invalid exp",u);switch(a.type){case"widget":switch(a.value){case"x":n=["OPGETWIDOFFSET",l(O.value),0];break;case"y":n=["OPGETWIDOFFSET",l(O.value),1];break;default:n=["OPGETWIDTE",t(a.value),l(O.value)]}break;case"layer":switch(a.value){case"x":n="IMM"==a.aVals[1]?["OPGETLAYOFFSET",a.aVals[0],0,l(O.value),0]:["OPGETLAYOFFSET",l(a.aVals[0]),0,l(O.value),1];break;case"y":n="IMM"==a.aVals[1]?["OPGETLAYOFFSET",a.aVals[0],1,l(O.value),0]:["OPGETLAYOFFSET",l(a.aVals[0]),1,l(O.value),1];break;default:n="IMM"==a.aVals[1]?["OPGETLAY",a.aVals[0],r(a.value),l(O.value)]:["OPGETLAYTE",l(a.aVals[0]),r(a.value),l(O.value)]}break;case"subLayer":n="IMM"==a.aVals[2]?["OPGETSUBLAY",a.aVals[1],E(a.value),P(a.value,a.aVals[0]),l(O.value)]:["OPGETSUBLAYTE",l(a.aVals[1]),E(a.value),P(a.value,a.aVals[0]),l(O.value)]}}}else if("EXP"==O.type)if("Int"==u.type){if(!(a=T(O)))throw console.log(O),new Error("invalid exp");switch(a.type){case"widget":switch(a.value){case"x":n=["OPSETWIDOFFSETIM",0,O.value];break;case"y":n=["OPSETWIDOFFSETIM",1,O.value];break;default:n=["OPSETWIDIM",t(a.value),u.value]}break;case"layer":switch(a.value){case"x":n="IMM"==a.aVals[1]?["OPSETLAYOFFSETIM",a.aVals[0],0,0,u.value]:["OPSETLAYOFFSETIM",l(a.aVals[0]),0,1,u.value];break;case"y":n="IMM"==a.aVals[1]?["OPSETLAYOFFSETIM",a.aVals[0],1,0,u.value]:["OPSETLAYOFFSETIM",l(a.aVals[0]),1,1,u.value];break;default:n="IMM"==a.aVals[1]?["OPSETLAY",a.aVals[0],r(a.value),0,u.value]:["OPSETLAY",l(a.aVals[0]),r(a.value),1,u.value]}break;case"subLayer":n="IMM"==a.aVals[2]?["OPSETSUBLAY",a.aVals[1],E(a.value),P(a.value,a.aVals[0]),u.value]:["OPSETSUBLAYTE",l(a.aVals[1]),E(a.value),P(a.value,a.aVals[0]),u.value]}}else if("ID"==u.type){if(!(a=T(O)))throw console.log(u),new Error("invalid exp",u);switch(a.type){case"widget":n=["OPSETWIDTE",t(a.value),u.value];break;case"layer":switch(a.value){case"x":n="IMM"==a.aVals[1]?["OPSETLAYOFFSETTE",a.aVals[0],0,l(u.value),0]:["OPSETLAYOFFSETTE",l(a.aVals[0]),0,l(u.value),1];break;case"y":n="IMM"==a.aVals[1]?["OPSETLAYOFFSETTE",a.aVals[0],1,l(u.value),0]:["OPSETLAYOFFSETTE",l(a.aVals[0]),1,l(u.value),1];break;default:n="IMM"==a.aVals[1]?["OPSETLAYTE",a.aVals[0],r(a.value),0,l(u.value)]:["OPSETLAYTE",l(a.aVals[0]),r(a.value),1,l(u.value)]}break;case"subLayer":n="IMM"==a.aVals[2]?["OPSETSUBLAYT",a.aVals[1],E(a.value),P(a.value,a.aVals[0]),l(u.value)]:["OPSETSUBLAYTET",l(a.aVals[1]),E(a.value),P(a.value,a.aVals[0]),l(u.value)]}}break;case"jump":n=["OPJUMP",e[2]];break;case"end":n=["OPNOP"];break;case"getTag":n=["OPGETTAG",l(e[1].value)];break;case"setTag":n="ID"==e[1].type?["OPSETTAGTE",l(e[1].value)]:["OPSETTAGIM",e[1].value];break;case"eq":n="ID"==e[2].type?["OPEQTE",l(e[1].value),l(e[2].value)]:["OPEQIM",l(e[1].value),e[2].value];break;case"lt":n="ID"==e[2].type?["OPLTTE",l(e[1].value),l(e[2].value)]:["OPLTIM",l(e[1].value),e[2].value];break;case"lte":n="ID"==e[2].type?["OPLTETE",l(e[1].value),l(e[2].value)]:["OPLTIM",l(e[1].value),e[2].value];break;case"gt":n="ID"==e[2].type?["OPGTTE",l(e[1].value),l(e[2].value)]:["OPGTIM",l(e[1].value),e[2].value];break;case"gte":n="ID"==e[2].type?["OPGTETE",l(e[1].value),l(e[2].value)]:["OPGTEIM",l(e[1].value),e[2].value];break;case"add":n="ID"==e[2].type?["OPADDTE",l(e[1].value),l(e[2].value)]:["OPADDIM",l(e[1].value),e[2].value];break;case"minus":n="ID"==e[2].type?["OPMINUSTE",l(e[1].value),l(e[2].value)]:["OPMINUSIM",l(e[1].value),e[2].value];break;case"multiply":n="ID"==e[2].type?["OPMULTE",l(e[1].value),l(e[2].value)]:["OPMULIM",l(e[1].value),e[2].value];break;case"divide":n="ID"==e[2].type?["OPDIVTE",l(e[1].value),l(e[2].value)]:["OPDIVIM",l(e[1].value),e[2].value];break;case"mod":n="ID"==e[2].type?["OPMODTE",l(e[1].value),l(e[2].value)]:["OPMODIM",l(e[1].value),e[2].value];break;case"and":n="ID"==e[2].type?["OPANDTE",l(e[1].value),cTempID(ommand[2].value)]:["OPANDIM",l(e[1].value),e[2].value];break;case"or":n="ID"==e[2].type?["OPORTE",l(e[1].value),l(e[2].value)]:["OPORIM",l(e[1].value),e[2].value];break;case"xor":n="ID"==e[2].type?["OPXORTE",l(e[1].value),l(e[2].value)]:["OPXORIM",l(e[1].value),e[2].value];break;case"not":n=e[2]&&"ID"==e[2].type?["OPNOTTE",l(e[1].value),l(e[2].value)]:["OPNOTIM",l(e[1].value)];break;case"checkalarm":n=["OPCHKVALALARM"];break;default:n=["OPNOP"]}return n}function s(e){return Array.prototype.map.call(new Uint8Array(e),function(e){return("00"+e.toString(16)).slice(-2)}).join("")}function i(e){var n=new ArrayBuffer(8),a=new DataView(n),w=1,O=0,T=e[0],l=k[T];l||console.log(e);var t=0;a.setUint8(O,l.index,!0),O+=1;for(var r=0;r<l.operands.length;r++){if(t=l.operands[r].bytes,!l.operands[r].reserve){switch(t){case 1:a.setUint8(O,e[w],!0);break;case 2:a.setUint16(O,e[w],!0);break;case 4:a.setUint32(O,e[w],!0);break;default:console.log("writing to buffer error",e)}w+=1}O+=t}return s(n)}function o(e){return e.map(function(e){return i(e)})}function I(e){var n=[],a=e.filter(function(e){return"temp"==e[0]}),w=0;D={};for(var O=0;O<a.length;O++){var T=a[O][1];T in D||(D[T]=w,w++)}n.push(["OPSTART",w,e.length]);for(var l=0;l<e.length;l++)n.push(u(e[l]));return n.push(["OPEND"]),o(n)}for(var M={},D={},S=["OPEND","OPSTART","OPSETLAY","OPSETLAYTE","OPGETLAY","OPGETLAYTE","OPSETSUBLAY","OPSETSUBLAYT","OPSETSUBLAYTE","OPSETSUBLAYTET","OPGETSUBLAY","OPGETSUBLAYTE","OPSETTEMP","OPGETTEMP","OPGETTAG","OPSETTAGIM","OPSETTAGTE","OPEQIM","OPEQTE","OPGTIM","OPGTTE","OPGTEIM","OPGTETE","OPLTIM","OPLTTE","OPLTEIM","OPLTETE","OPJUMP","OPADDIM","OPADDTE","OPMINUSIM","OPMINUSTE","OPMULIM","OPMULTE","OPDIVIM","OPDIVTE","OPMODIM","OPMODTE","OPANDIM","OPANDTE","OPORIM","OPORTE","OPXORIM","OPXORTE","OPNOTIM","OPNOTTE","OPSETWIDIM","OPSETWIDTE","OPGETWIDTE","OPSETWIDOFFSETIM","OPSETWIDOFFSETTE","OPGETWIDOFFSET","OPSETLAYOFFSETIM","OPSETLAYOFFSETTE","OPGETLAYOFFSET","OPCHKVALALARM","OPNOP"],A={},v=0;v<S.length;v++)A[S[v]]=v;for(var m=[new e("mWDGStartTag",4),new e("mWDGStopTag",4),new e("mWDGMinValue",4),new e("mWDGMaxValue",4),new e("mWDGLowAlarmValue",4),new e("mWDGHighAlarmValue",4),new e("mWDGMinAngle",4),new e("mWDGMaxAngle",4),new e("mWDGOldValue",4),new e("mWDGAnTag",4),new e("mWDGNumOfLayers",4),new e("mWDGStartAddrOfLayers",4),new e("mWDGWidgetWidth",4),new e("mWDGWidgetHeight",4),new e("mWDGWidgetOffsetX",4),new e("mWDGWidgetOffsetY",4),new e("mWDGBindTagID",4),new e("mWDGAttatchCanvasID",4),new e("mWDGPreWidgetID",4),new e("mWDGNextWidgetID",4),new e("mWDGTotalFrame",4),new e("mWDGNowFrame",4),new e("mWDGInteractionMode",4),new e("mWDGMode",4),new e("mWDGArrange",4),new e("mWDGType"),new e("mWDGAnimationSclerX"),new e("mWDGAnimationSclerY"),new e("mWDGAnimationMovingX"),new e("mWDGAnimationMovingY"),new e("mWDGAnimationRotateAngle"),new e("mWDGAnimationShearAngleX"),new e("mWDGAnimationShearAngleY"),new e("mWDGAnimationProjectionAngleX"),new e("mWDGAnimationProjectionAngleY"),new e("mWDGOnInitializeFunc"),new e("mWDGOnDestroyFunc"),new e("mWDGOnTagChangeFunc"),new e("mWDGOnMouseUpFunc"),new e("mWDGOnMouseDownFunc"),new e("mWDGOnMouseMove"),new e("mWDGOnKeyBoardLeft"),new e("mWDGOnKeyBoardRight"),new e("mWDGOnKeyBoardOK"),new e("mWDGMouseInnerX"),new e("mWDGMouseInnerY"),new e("mWDGOnAnimationFrame"),new e("mWDGEnterLowAlarmAction"),new e("mWDGLeaveLowAlarmAction"),new e("mWDGEnterHighAlarmAction"),new e("mWDGLeaveHighAlarmAction"),new e("mWDGMouseReleaseAction"),new e("mWDGOldValueInit")],G={},v=0;v<m.length;v++){var L=m[v];L.index=v,G[L.name]=L}for(var c=0;c<20;c++){var W=v+c;G["a"+W]=new e("a"+W,4,W)}console.log("cppWidgetAttrsTable",G);for(var d={info:{left:"x",top:"y",width:"mWDGWidgetWidth",height:"mWDGWidgetHeight"},arrange:"mWDGArrange",mode:"mWDGMode",oldValue:"mWDGOldValue",minValue:"mWDGMinValue",maxValue:"mWDGMaxValue",lowAlarmValue:"mWDGLowAlarmValue",highAlarmValue:"mWDGHighAlarmValue",minAngle:"mWDGMinAngle",maxAngle:"mWDGMaxAngle",numOfLayers:"mWDGNumOfLayers",interaction:"mWDGInteractionMode",tag:"mWDGBindTagID",generalType:"mWDGType",otherAttrs:"otherAttrs",innerX:"mWDGMouseInnerX",innerY:"mWDGMouseInnerY",oldValueInit:"mWDGOldValueInit"},g=[new e("mLayerOffsetX",4),new e("mLayerOffsetY",4),new e("scalerX",4),new e("scalerY",4),new e("MovingX",4),new e("MovingY",4),new e("rotateAngle",4),new e("shearAngleX",4),new e("shearAngleY",4),new e("projectX",4),new e("projectY",4),new e("mWidth",4),new e("mHeight",4),new e("mValidSubLayer",4),new e("mHidden",4),new e("tileBoxClass",4),new e("mRotaCenterX",4),new e("mRotaCenterY",4)],y={},v=0;v<g.length;v++){var f=g[v];f.index=v,y[f.name]=f}for(var h={x:"x",y:"y",width:"mWidth",height:"mHeight",hidden:"mHidden",rotateAngle:"rotateAngle",rotateCenterX:"mRotaCenterX",rotateCenterY:"mRotaCenterY"},p={roi:"SubLayerClassROI",font:"SubLayerClassFont",texture:"SubLayerClassImage",color:"SubLayerClassColor"},F={SubLayerClassROI:new e("SubLayerClassROI",16,0),SubLayerClassFont:new e("SubLayerClassFOnt",8,1),SubLayerClassImage:new e("SubLayerClassImage",4,2),SubLayerClassColor:new e("SubLayerClassColor",4,3)},Y=["p1x","p1y","p2x","p2y","p3x","p3y","p4x","p4y","alpha","beta","mode"],b={},v=0;v<Y.length;v++)b[Y[v]]=new e(Y[v],1,v);for(var V={fontStyle:new e("fontStyle",4,0),text:new e("text",1,1)},U={texture:new e("texture",4,0),type:new e("type",4,1)},x={r:new e("r",1,0),g:new e("g",1,1),b:new e("b",1,2),a:new e("a",1,3)},k={OPEND:new a("OPEND",new n(7,!0)),OPSTART:new a("OPSTART",new n(1),new n(2),new n(4,!0)),OPSETLAY:new a("OPSETLAY",new n(1),new n(1),new n(1),new n(4)),OPSETLAYTE:new a("OPSETLAYTE",new n(1),new n(1),new n(1),new n(1),new n(3,!0)),OPGETLAY:new a("OPGETLAY",new n(1),new n(1),new n(1),new n(4,!0)),OPGETLAYTE:new a("OPGETLAYTE",new n(1),new n(1),new n(1),new n(4,!0)),OPSETSUBLAY:new a("OPSETSUBLAY",new n(1),new n(1),new n(1),new n(4)),OPSETSUBLAYTE:new a("OPSETSUBLAYTE",new n(1),new n(1),new n(1),new n(4)),OPSETSUBLAYT:new a("OPSETSUBLAY",new n(1),new n(1),new n(1),new n(1),new n(3,!0)),OPSETSUBLAYTET:new a("OPSETSUBLAYTE",new n(1),new n(1),new n(1),new n(1),new n(3,!0)),OPGETSUBLAY:new a("OPGETSUBLAY",new n(1),new n(1),new n(1),new n(1),new n(3,!0)),OPGETSUBLAYTE:new a("OPGETSUBLAYTE",new n(1),new n(1),new n(1),new n(1),new n(3,!0)),OPSETTEMP:new a("OPSETTEMP",new n(1),new n(2,!0),new n(4)),OPGETTEMP:new a("OPGETTEMP",new n(1),new n(1),new n(5,!0)),OPGETTAG:new a("OPGETTAG",new n(1),new n(6,!0)),OPSETTAGIM:new a("OPSETTAGIM",new n(3,!0),new n(4)),OPSETTAGTE:new a("OPSETTAGTE",new n(1),new n(6,!0)),OPEQIM:new a("OPEQIM",new n(1),new n(2,!0),new n(4)),OPEQTE:new a("OPEQTE",new n(1),new n(1),new n(5,!0)),OPGTIM:new a("OPGTIM",new n(1),new n(2,!0),new n(4)),OPGTTE:new a("OPGTTE",new n(1),new n(1),new n(5,!0)),OPGTEIM:new a("OPGTEIM",new n(1),new n(2,!0),new n(4)),OPGTETE:new a("OPGTETE",new n(1),new n(1),new n(5,!0)),OPLTIM:new a("OPLTIM",new n(1),new n(2,!0),new n(4)),OPLTTE:new a("OPLTTE",new n(1),new n(1),new n(5,!0)),OPLTEIM:new a("OPLTEIM",new n(1),new n(2,!0),new n(4)),OPLTETE:new a("OPLTETE",new n(1),new n(1),new n(5,!0)),OPJUMP:new a("OPJUMP",new n(1,!0),new n(2),new n(4,!0)),OPADDIM:new a("OPADDIM",new n(1),new n(2,!0),new n(4)),OPMINUSIM:new a("OPMINUSIM",new n(1),new n(2,!0),new n(4)),OPMULIM:new a("OPMULIM",new n(1),new n(2,!0),new n(4)),OPDIVIM:new a("OPDIVIM",new n(1),new n(2,!0),new n(4)),OPMODIM:new a("OPMODIM",new n(1),new n(2,!0),new n(4)),OPADDTE:new a("OPADDTE",new n(1),new n(1),new n(5,!0)),OPMINUSTE:new a("OPMINUSTE",new n(1),new n(1),new n(5,!0)),OPMULTE:new a("OPMULTE",new n(1),new n(1),new n(5,!0)),OPDIVTE:new a("OPDIVTE",new n(1),new n(1),new n(5,!0)),OPMODTE:new a("OPMODTE",new n(1),new n(1),new n(5,!0)),OPANDIM:new a("OPANDIM",new n(1),new n(2,!0),new n(4)),OPORIM:new a("OPORIM",new n(1),new n(2,!0),new n(4)),OPXORIM:new a("OPXORIM",new n(1),new n(2,!0),new n(4)),OPNOTIM:new a("OPNOTIM",new n(1),new n(6,!0)),OPANDTE:new a("OPANDTE",new n(1),new n(1),new n(5,!0)),OPORTE:new a("OPORTE",new n(1),new n(1),new n(5,!0)),OPXORTE:new a("OPXORTE",new n(1),new n(1),new n(5,!0)),OPNOTTE:new a("OPNOTTE",new n(1),new n(1),new n(5,!0)),OPSETWIDIM:new a("OPSETWIDIM",new n(1),new n(2,!0),new n(4)),OPSETWIDTE:new a("OPSETWIDTE",new n(1),new n(1),new n(5,!0)),OPGETWIDTE:new a("OPGETWIDTE",new n(1),new n(1),new n(5,!0)),OPSETWIDOFFSETIM:new a("OPSETWIDOFFSETIM",new n(1),new n(2,!0),new n(4)),OPSETWIDOFFSETTE:new a("OPSETWIDOFFSETTE",new n(1),new n(1),new n(5,!0)),OPGETWIDOFFSET:new a("OPGETWIDOFFSET",new n(1),new n(1),new n(5)),OPSETLAYOFFSETIM:new a("OPSETLAYOFFSETIM",new n(1),new n(1),new n(1,!0),new n(4)),OPSETLAYOFFSETTE:new a("OPSETLAYOFFSETTE",new n(1),new n(1),new n(1),new n(4,!0)),OPGETLAYOFFSET:new a("OPGETLAYOFFSET",new n(1),new n(1),new n(1),new n(4,!0)),OPCHKVALALARM:new a("OPCHKVALALARM",new n(7,!0)),OPNOP:new a("OPNOP",new n(7,!0))},v=0;v<S.length;v++)k[S[v]].index=v;return M.transJSWidgetCommandToCPPForm=u,M.transJSWidgetCommands=I,M});