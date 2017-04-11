!function(e){"function"==typeof define&&define.amd?define("cppWidgetCommandTranslator",[],e):"object"==typeof module&&module.exports?module.exports=e():window.cppWidgetCommandTranslator=e()}(function(){function e(e,n,a){this.name=e||"",this.bytes=n||0,this.index=a||0}function n(e,n){this.bytes=e,this.reserve=n||!1}function a(e){this.op=e,this.operands=[].slice.call(arguments,1)}function w(e,n){this.type=e,this.value=n,this.aVals=[].slice.call(arguments,2)}function O(e){var n=/^[0-9]+$/;return n.test(e)}function l(e){var n=e.value.split(".");if(2==n.length&&"this"==n[0])return new w("widget",y[n[1]]);if(3==n.length){if("this"==n[0]&&"info"==n[1])return new w("widget",y.info[n[2]]);if("this"==n[0]&&"layers"==n[1]&&"length"==n[2])return new w("widget",y.numOfLayers);if("this"==n[0]&&"otherAttrs"==n[1]&&O(n[2]))return new w("widget","a"+(M.length+Number(n[2])))}return 4==n.length&&"this"==n[0]&&"layers"==n[1]?O(n[2])?new w("layer",c[n[3]],Number(n[2]),"IMM"):new w("layer",c[n[3]],n[2],"ID"):6==n.length&&"this"==n[0]&&"layers"==n[1]&&"subLayers"==n[3]?O(n[2])?new w("subLayer",p[n[4]],n[5],Number(n[2]),"IMM"):new w("subLayer",p[n[4]],n[5],n[2],"ID"):null}function T(e){return e}function t(e){return e}function P(e){return e}function E(e,n){return n}function r(e){var n,a,w=e[0];switch(w){case"temp":n=["OPSETTEMP",e[1],e[2].value];break;case"set":var O=e[1],r=e[2];if("ID"==O.type){if("Int"==r.type)n=["OPSETTEMP",e[1].value,e[2].value];else if("ID"==r.type)n=["OPGETTEMP",e[1].value,e[2].value];else if("EXP"==r.type){if(a=l(r),!a)throw console.log(r),new Error("invalid exp",r);switch(a.type){case"widget":n=["OPGETWIDTE",T(a.value),O.value];break;case"layer":n="IMM"==a.aVals[1]?["OPGETLAY",a.aVals[0],t(a.value),O.value]:["OPGETLAYTE",a.aVals[0],t(a.value),O.value];break;case"subLayer":n="IMM"==a.aVals[2]?["OPGETSUBLAY",a.aVals[1],P(a.value),E(a.value,a.aVals[0]),O.value]:["OPGETSUBLAYTE",a.aVals[1],P(a.value),E(a.value,a.aVals[0]),O.value]}}}else if("EXP"==O.type)if("Int"==r.type){if(a=l(O),!a)throw console.log(O),new Error("invalid exp");switch(a.type){case"widget":n=["OPSETWIDIM",T(a.value),r.value];break;case"layer":n="IMM"==a.aVals[1]?["OPSETLAY",a.aVals[0],t(a.value),0,r.value]:["OPSETLAY",a.aVals[0],t(a.value),1,r.value];break;case"subLayer":n="IMM"==a.aVals[2]?["OPSETSUBLAY",a.aVals[1],P(a.value),E(a.value,a.aVals[0]),r.value]:["OPSETSUBLAYTE",a.aVals[1],P(a.value),E(a.value,a.aVals[0]),r.value]}}else if("ID"==r.type){if(a=l(O),!a)throw console.log(r),new Error("invalid exp",r);switch(a.type){case"widget":n=["OPSETWIDTE",T(a.value),r.value];break;case"layer":n="IMM"==a.aVals[1]?["OPSETLAYTE",a.aVals[0],t(a.value),0,r.value]:["OPSETLAYTE",a.aVals[0],t(a.value),1,r.value];break;case"subLayer":n="IMM"==a.aVals[2]?["OPSETSUBLAYT",a.aVals[1],P(a.value),E(a.value,a.aVals[0]),r.value]:["OPSETSUBLAYTET",a.aVals[1],P(a.value),E(a.value,a.aVals[0]),r.value]}}break;case"jump":n=["OPJUMP",e[2]];break;case"end":n=["OPNOP"];break;case"getTag":n=["OPGETTAG",e[1].value];break;case"setTag":n="ID"==e[1].type?["OPSETTAGTE",e[1].value]:["OPSETTAGIM",e[1].value];break;case"eq":n="ID"==e[2].type?["OPEQTE",e[1].value,e[2].value]:["OPEQIM",e[1].value,e[2].value];break;case"lt":n="ID"==e[2].type?["OPLTTE",e[1].value,e[2].value]:["OPLTIM",e[1].value,e[2].value];break;case"lte":n="ID"==e[2].type?["OPLTETE",e[1].value,e[2].value]:["OPLTIM",e[1].value,e[2].value];break;case"gt":n="ID"==e[2].type?["OPGTTE",e[1].value,e[2].value]:["OPGTIM",e[1].value,e[2].value];break;case"gte":n="ID"==e[2].type?["OPGTETE",e[1].value,e[2].value]:["OPGTEIM",e[1].value,e[2].value];break;case"add":n="ID"==e[2].type?["OPADDTE",e[1].value,e[2].value]:["OPADDIM",e[1].value,e[2].value];break;case"minus":n="ID"==e[2].type?["OPMINUSTE",e[1].value,e[2].value]:["OPMINUSIM",e[1].value,e[2].value];break;case"multiply":n="ID"==e[2].type?["OPMULTE",e[1].value,e[2].value]:["OPMULIM",e[1].value,e[2].value];break;case"divide":n="ID"==e[2].type?["OPDIVTE",e[1].value,e[2].value]:["OPDIVIM",e[1].value,e[2].value];break;case"mod":n="ID"==e[2].type?["OPMODTE",e[1].value,e[2].value]:["OPMODIM",e[1].value,e[2].value];break;case"and":n="ID"==e[2].type?["OPANDTE",e[1].value,e[2].value]:["OPANDIM",e[1].value,e[2].value];break;case"or":n="ID"==e[2].type?["OPORTE",e[1].value,e[2].value]:["OPORIM",e[1].value,e[2].value];break;case"xor":n="ID"==e[2].type?["OPXORTE",e[1].value,e[2].value]:["OPXORIM",e[1].value,e[2].value];break;case"not":n="ID"==e[2].type?["OPNOTTE",e[1].value,e[2].value]:["OPNOTIM",e[1].value]}return n}function u(e){return e.map(function(e){return r(e)})}for(var s={},I=["OPEND","OPSTART","OPSETLAYIM","OPSETLAYIN","OPSETSUBLAYIM","OPSETSUBLAYIN","OPSETTEMPIM","OPSETTEMPIN","OPGETTAG","OPSETTAGIM","OPSETTAGIN","OPSETTAGTE","OPEQIM","OPEQIN","OPJUMP","OPADDIM","OPADDIN","OPMINUSIM","OPMINUSIN","OPMULIM","OPMULIN","OPDIVIM","OPDIVIN","OPANDIM","OPANDIN","OPORIM","OPORIN","OPXORIM","OPXORIN","OPNOTIM","OPNOTIN"],i={},v=0;v<I.length;v++)i[I[v]]=v;for(var M=[new e("startTag",4),new e("stopTag",4),new e("minValue",4),new e("maxValue",4),new e("lowAlarmValue",4),new e("highAlarmValue",4),new e("minAngle",4),new e("maxAngle",4),new e("oldValue",4),new e("mATag",4),new e("numOfLayers",4),new e("startAddrOfLayers",4),new e("widgetWidth",4),new e("widgetHeight",4),new e("mWidgetOffsetX",4),new e("mWidgetOffsetY",4),new e("mBindTagID",4),new e("attatchCanvasID",4),new e("preWidgetID",4),new e("nextWidgetID",4),new e("totalFrame",4),new e("nowFrame",4),new e("mInteraction",4),new e("mMode",4),new e("mArrange",4),new e("generalType",4)],S={},v=0;v<M.length;v++){var o=M[v];o.index=v,S[o.name]=o}for(var A=0;A<20;A++){var L=v+A;S["a"+L]=new e("a"+L,4,L)}console.log("cppWidgetAttrsTable",S);for(var y={info:{left:"mWidgetOffsetX",top:"mWidgetOffsetY",width:"widgetWidth",height:"widgetHeight"},minValue:"minValue",maxValue:"maxValue",lowAlarmValue:"lowAlarmValue",highAlarmValue:"highAlarmValue",minAngle:"minAngle",maxAngle:"maxAngle",numOfLayers:"numOfLayers",interaction:"mInteraction",tag:"mBindTagID",generalType:"generalType",otherAttrs:"otherAttrs"},D=[new e("mLayerOffsetX",4),new e("mLayerOffsetY",4),new e("tileBoxClass",4),new e("scalerX",4),new e("scalerY",4),new e("MovingX",4),new e("MovingY",4),new e("rotateAngle",4),new e("shearAngleX",4),new e("shearAngleY",4),new e("projectX",4),new e("projectY",4),new e("mWidth",4),new e("mHeight",4),new e("mValidSubLayer",4),new e("mHidden",4)],g={},v=0;v<D.length;v++){var m=D[v];m.index=v,g[m.name]=m}console.log("layerAttrTable",g);for(var c={x:"mLayerOffsetX",y:"mLayerOffsetY",width:"mWidth",height:"mHeight",hidden:"mHidden"},p={roi:"SubLayerClassROI",font:"SubLayerClassFont",texture:"SubLayerClassImage",color:"SubLayerClassColor"},f=({SubLayerClassROI:new e("SubLayerClassROI",16,0),SubLayerClassFont:new e("SubLayerClassFOnt",8,1),SubLayerClassImage:new e("SubLayerClassImage",4,2),SubLayerClassColor:new e("SubLayerClassColor",4,3)},["p1x","p1y","p2x","p2y","p3x","p3y","p4x","p4y","p5x","p5y","p6x","p6y","p7x","p7y","p8x","p8y"]),d={},v=0;v<f.length;v++)d[f[v]]=new e(f[v],1,v);({fontStyle:new e("fontStyle",4,0),text:new e("text",4,1)}),{texture:new e("texture",4,0)},{r:new e("r",1,0),g:new e("g",1,1),b:new e("b",1,2),a:new e("a",1,3)},{OPEND:new a("OPEND",new n(7,(!0))),OPSTART:new a("OPSTART",new n(1),new n(2),new n(4,(!0))),OPSETLAY:new a("OPSETLAY",new n(1),new n(2),new n(4)),OPSETLAYTE:new a("OPSETLAYTE",new n(1),new n(1),new n(1,(!0)),new n(4)),OPGETLAY:new a("OPGETLAY",new n(1),new n(1),new n(1),new n(4,(!0))),OPGETLAYTE:new a("OPGETLAYTE",new n(1),new n(1),new n(1),new n(3,(!0))),OPSETSUBLAY:new a("OPSETSUBLAY",new n(1),new n(1),new n(1),new n(4)),OPSETSUBLAYTE:new a("OPSETSUBLAYTE",new n(1),new n(1),new n(1),new n(4)),OPGETSUBLAY:new a("OPGETSUBLAY",new n(1),new n(1),new n(1),new n(1),new n(3,(!0))),OPGETSUBLAYTE:new a("OPGETSUBLAYTE",new n(1),new n(1),new n(1),new n(1),new n(3,(!0))),OPSETTEMP:new a("OPSETTEMP",new n(1),new n(2,(!0)),new n(4)),OPGETTEMP:new a("OPGETTEMP",new n(1),new n(1),new n(5,(!0))),OPGETTAG:new a("OPGETTAG",new n(1),new n(6,(!0))),OPSETTAGIM:new a("OPSETTAGIM",new n(3,(!0)),new n(4)),OPSETTAGTE:new a("OPSETTAGTE",new n(1),new n(6,(!0))),OPEQIM:new a("OPEQIM",new n(1),new n(2,(!0)),new n(4)),OPEQTE:new a("OPEQTE",new n(1),new n(1),new a(5,(!0))),OPGTIM:new a("OPGTIM",new n(1),new n(2,(!0)),new n(4)),OPGTTE:new a("OPGTTE",new n(1),new n(1),new a(5,(!0))),OPGTEIM:new a("OPGTEIM",new n(1),new n(2,(!0)),new n(4)),OPGTETE:new a("OPGTETE",new n(1),new n(1),new a(5,(!0))),OPLTIM:new a("OPLTIM",new n(1),new n(2,(!0)),new n(4)),OPLTTE:new a("OPLTTE",new n(1),new n(1),new a(5,(!0))),OPLTEIM:new a("OPLTEIM",new n(1),new n(2,(!0)),new n(4)),OPLTETE:new a("OPLTETE",new n(1),new n(1),new a(5,(!0))),OPJUMP:new a("OPJUMP",new n(5,(!0)),new n(2)),OPADDIM:new a("OPADDIM",new n(1),new n(2,(!0)),new n(4)),OPMINUSIM:new a("OPMINUSIM",new n(1),new n(2,(!0)),new n(4)),OPMULIM:new a("OPMULIM",new n(1),new n(2,(!0)),new n(4)),OPDIVIM:new a("OPDIVIM",new n(1),new n(2,(!0)),new n(4)),OPMODIM:new a("OPMODIM",new n(1),new n(2,(!0)),new n(4)),OPADDTE:new a("OPADDTE",new n(1),new n(1),new n(5,(!0))),OPMINUSTE:new a("OPMINUSTE",new n(1),new n(1),new n(5,(!0))),OPMULTE:new a("OPMULTE",new n(1),new n(1),new n(5,(!0))),OPDIVTE:new a("OPDIVTE",new n(1),new n(1),new n(5,(!0))),OPMODTE:new a("OPMODTE",new n(1),new n(1),new n(5,(!0))),OPANDIM:new a("OPANDIM",new n(1),new n(2,(!0)),new n(4)),OPORIM:new a("OPORIM",new n(1),new n(2,(!0)),new n(4)),OPXORIM:new a("OPXORIM",new n(1),new n(2,(!0)),new n(4)),OPNOTIM:new a("OPNOTIM",new n(1),new n(6,(!0))),OPANDTE:new a("OPANDTE",new n(1),new n(1),new n(5,(!0))),OPORTE:new a("OPORTE",new n(1),new n(1),new n(5,(!0))),OPXORTE:new a("OPXORTE",new n(1),new n(1),new n(5,(!0))),OPNOTTE:new a("OPNOTTE",new n(1),new n(1),new n(5,(!0))),OPSETWIDIM:new a("OPSETWIDIM",new n(1),new n(2,(!0)),new n(4)),OPSETWIDTE:new a("OPSETWIDTE",new n(1),new n(1),new n(5,(!0))),OPGETWIDTE:new a("OPGETWIDTE",new n(1),new n(1),new n(5,(!0))),OPSETWIDOFFSETIM:new a("OPSETWIDOFFSETIM",new n(1),new n(2,(!0)),new n(4)),OPSETWIDOFFSETTE:new a("OPSETWIDOFFSETTE",new n(1),new n(1),new n(5,(!0))),OPGETWIDOFFSET:new a("OPGETWIDOFFSET",new n(1),new n(1),new n(5)),OPSETLAYOFFSETIM:new a("OPSETLAYOFFSETIM",new n(1),new n(1),new n(1,(!0)),new n(4)),OPSETLAYOFFSETTE:new a("OPSETLAYOFFSETTE",new n(1),new n(1),new n(1),new n(4,(!0))),OPGETLAYOFFSET:new a("OPGETLAYOFFSET",new n(1),new n(1),new n(1),new n(4,(!0))),OPNOP:new a("OPNOP",new n(7,(!0)))};return s.transJSWidgetCommandToCPPForm=r,s.transJSWidgetCommands=u,s});