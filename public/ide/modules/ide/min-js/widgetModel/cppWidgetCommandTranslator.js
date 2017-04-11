!function(e){"function"==typeof define&&define.amd?define("cppWidgetCommandTranslator",[],e):"object"==typeof module&&module.exports?module.exports=e():window.cppWidgetCommandTranslator=e()}(function(){function e(e,a,n){this.name=e||"",this.bytes=a||0,this.index=n||0}function a(e,a){this.bytes=e,this.reserve=a||!1}function n(e){this.op=e,this.operands=[].slice.call(arguments,1)}function w(e,a){this.type=e,this.value=a,this.aVals=[].slice.call(arguments,2)}function l(e){var a=/^[0-9]+$/;return a.test(e)}function O(e){var a=e.value.split(".");if(2==a.length&&"this"==a[0])return new w("widget",c[a[1]]);if(3==a.length){if("this"==a[0]&&"info"==a[1])return new w("widget",c.info[a[2]]);if("this"==a[0]&&"layers"==a[1]&&"length"==a[2])return new w("widget",c.numOfLayers);if("this"==a[0]&&"otherAttrs"==a[1]&&l(a[2]))return new w("widget","a"+(M.length+Number(a[2])))}return 4==a.length&&"this"==a[0]&&"layers"==a[1]?l(a[2])?new w("layer",g[a[3]],Number(a[2]),"IMM"):new w("layer",g[a[3]],a[2],"ID"):6==a.length&&"this"==a[0]&&"layers"==a[1]&&"subLayers"==a[3]?l(a[2])?new w("subLayer",m[a[4]],a[5],Number(a[2]),"IMM"):new w("subLayer",m[a[4]],a[5],a[2],"ID"):null}function T(e){return S[e].index}function E(e){return D[e].index}function P(e){return p[e].index}function t(e,a){switch(e){case"SubLayerClassROI":return f[a].index;case"SubLayerClassImage":return V[a].index;case"SubLayerClassFont":return h[a].index;case"SubLayerClassColor":return F[a].index}}function u(e){var a,n,w=e[0];switch(w){case"temp":a=["OPSETTEMP",e[1],e[2].value];break;case"set":var l=e[1],u=e[2];if("ID"==l.type){if("Int"==u.type)a=["OPSETTEMP",e[1].value,e[2].value];else if("ID"==u.type)a=["OPGETTEMP",e[1].value,e[2].value];else if("EXP"==u.type){if(n=O(u),!n)throw console.log(u),new Error("invalid exp",u);switch(n.type){case"widget":switch(n.value){case"x":a=["OPGETWIDOFFSET",l.value,0];break;case"y":a=["OPGETWIDOFFSET",l.value,1];break;default:a=["OPGETWIDTE",T(n.value),l.value]}break;case"layer":switch(n.value){case"x":a="IMM"==n.aVals[1]?["OPGETLAYOFFSET",n.aVals[0],0,l.value,0]:["OPGETLAYOFFSET",n.aVals[0],0,l.value,1];break;case"y":a="IMM"==n.aVals[1]?["OPGETLAYOFFSET",n.aVals[0],1,l.value,0]:["OPGETLAYOFFSET",n.aVals[0],1,l.value,1];break;default:a="IMM"==n.aVals[1]?["OPGETLAY",n.aVals[0],E(n.value),l.value]:["OPGETLAYTE",n.aVals[0],E(n.value),l.value]}break;case"subLayer":a="IMM"==n.aVals[2]?["OPGETSUBLAY",n.aVals[1],P(n.value),t(n.value,n.aVals[0]),l.value]:["OPGETSUBLAYTE",n.aVals[1],P(n.value),t(n.value,n.aVals[0]),l.value]}}}else if("EXP"==l.type)if("Int"==u.type){if(n=O(l),!n)throw console.log(l),new Error("invalid exp");switch(n.type){case"widget":switch(n.value){case"x":a=["OPSETWIDOFFSETIM",0,l.value];break;case"y":a=["OPSETWIDOFFSETIM",1,l.value];break;default:a=["OPSETWIDIM",T(n.value),u.value]}break;case"layer":switch(n.value){case"x":a="IMM"==n.aVals[1]?["OPSETLAYOFFSETIM",n.aVals[0],E(n.value),0,0,u.value]:["OPSETLAYOFFSETIM",n.aVals[0],E(n.value),0,1,u.value];break;case"y":a="IMM"==n.aVals[1]?["OPSETLAYOFFSETIM",n.aVals[0],E(n.value),1,0,u.value]:["OPSETLAYOFFSETIM",n.aVals[0],E(n.value),1,1,u.value];break;default:a="IMM"==n.aVals[1]?["OPSETLAY",n.aVals[0],E(n.value),0,u.value]:["OPSETLAY",n.aVals[0],E(n.value),1,u.value]}break;case"subLayer":a="IMM"==n.aVals[2]?["OPSETSUBLAY",n.aVals[1],P(n.value),t(n.value,n.aVals[0]),u.value]:["OPSETSUBLAYTE",n.aVals[1],P(n.value),t(n.value,n.aVals[0]),u.value]}}else if("ID"==u.type){if(n=O(l),!n)throw console.log(u),new Error("invalid exp",u);switch(n.type){case"widget":a=["OPSETWIDTE",T(n.value),u.value];break;case"layer":switch(n.value){case"x":a="IMM"==n.aVals[1]?["OPSETLAYOFFSETTE",n.aVals[0],E(n.value),0,u.value,0]:["OPSETLAYOFFSETTE",n.aVals[0],E(n.value),0,u.value,1];break;case"y":a="IMM"==n.aVals[1]?["OPSETLAYOFFSETTE",n.aVals[0],E(n.value),1,u.value,0]:["OPSETLAYOFFSETTE",n.aVals[0],E(n.value),1,u.value,1];break;default:a="IMM"==n.aVals[1]?["OPSETLAYTE",n.aVals[0],E(n.value),0,u.value]:["OPSETLAYTE",n.aVals[0],E(n.value),1,u.value]}break;case"subLayer":a="IMM"==n.aVals[2]?["OPSETSUBLAYT",n.aVals[1],P(n.value),t(n.value,n.aVals[0]),u.value]:["OPSETSUBLAYTET",n.aVals[1],P(n.value),t(n.value,n.aVals[0]),u.value]}}break;case"jump":a=["OPJUMP",e[2]];break;case"end":a=["OPNOP"];break;case"getTag":a=["OPGETTAG",e[1].value];break;case"setTag":a="ID"==e[1].type?["OPSETTAGTE",e[1].value]:["OPSETTAGIM",e[1].value];break;case"eq":a="ID"==e[2].type?["OPEQTE",e[1].value,e[2].value]:["OPEQIM",e[1].value,e[2].value];break;case"lt":a="ID"==e[2].type?["OPLTTE",e[1].value,e[2].value]:["OPLTIM",e[1].value,e[2].value];break;case"lte":a="ID"==e[2].type?["OPLTETE",e[1].value,e[2].value]:["OPLTIM",e[1].value,e[2].value];break;case"gt":a="ID"==e[2].type?["OPGTTE",e[1].value,e[2].value]:["OPGTIM",e[1].value,e[2].value];break;case"gte":a="ID"==e[2].type?["OPGTETE",e[1].value,e[2].value]:["OPGTEIM",e[1].value,e[2].value];break;case"add":a="ID"==e[2].type?["OPADDTE",e[1].value,e[2].value]:["OPADDIM",e[1].value,e[2].value];break;case"minus":a="ID"==e[2].type?["OPMINUSTE",e[1].value,e[2].value]:["OPMINUSIM",e[1].value,e[2].value];break;case"multiply":a="ID"==e[2].type?["OPMULTE",e[1].value,e[2].value]:["OPMULIM",e[1].value,e[2].value];break;case"divide":a="ID"==e[2].type?["OPDIVTE",e[1].value,e[2].value]:["OPDIVIM",e[1].value,e[2].value];break;case"mod":a="ID"==e[2].type?["OPMODTE",e[1].value,e[2].value]:["OPMODIM",e[1].value,e[2].value];break;case"and":a="ID"==e[2].type?["OPANDTE",e[1].value,e[2].value]:["OPANDIM",e[1].value,e[2].value];break;case"or":a="ID"==e[2].type?["OPORTE",e[1].value,e[2].value]:["OPORIM",e[1].value,e[2].value];break;case"xor":a="ID"==e[2].type?["OPXORTE",e[1].value,e[2].value]:["OPXORIM",e[1].value,e[2].value];break;case"not":a="ID"==e[2].type?["OPNOTTE",e[1].value,e[2].value]:["OPNOTIM",e[1].value]}return a}function s(e){return e.map(function(e){return u(e)})}for(var r={},I=["OPEND","OPSTART","OPSETLAYIM","OPSETLAYIN","OPSETSUBLAYIM","OPSETSUBLAYIN","OPSETTEMPIM","OPSETTEMPIN","OPGETTAG","OPSETTAGIM","OPSETTAGIN","OPSETTAGTE","OPEQIM","OPEQIN","OPJUMP","OPADDIM","OPADDIN","OPMINUSIM","OPMINUSIN","OPMULIM","OPMULIN","OPDIVIM","OPDIVIN","OPANDIM","OPANDIN","OPORIM","OPORIN","OPXORIM","OPXORIN","OPNOTIM","OPNOTIN"],v={},i=0;i<I.length;i++)v[I[i]]=i;for(var M=[new e("startTag",4),new e("stopTag",4),new e("minValue",4),new e("maxValue",4),new e("lowAlarmValue",4),new e("highAlarmValue",4),new e("minAngle",4),new e("maxAngle",4),new e("oldValue",4),new e("mATag",4),new e("numOfLayers",4),new e("startAddrOfLayers",4),new e("widgetWidth",4),new e("widgetHeight",4),new e("mWidgetOffsetX",4),new e("mWidgetOffsetY",4),new e("mBindTagID",4),new e("attatchCanvasID",4),new e("preWidgetID",4),new e("nextWidgetID",4),new e("totalFrame",4),new e("nowFrame",4),new e("mInteraction",4),new e("mMode",4),new e("mArrange",4),new e("generalType",4)],S={},i=0;i<M.length;i++){var o=M[i];o.index=i,S[o.name]=o}for(var A=0;A<20;A++){var L=i+A;S["a"+L]=new e("a"+L,4,L)}console.log("cppWidgetAttrsTable",S);for(var c={info:{left:"x",top:"y",width:"widgetWidth",height:"widgetHeight"},minValue:"minValue",maxValue:"maxValue",lowAlarmValue:"lowAlarmValue",highAlarmValue:"highAlarmValue",minAngle:"minAngle",maxAngle:"maxAngle",numOfLayers:"numOfLayers",interaction:"mInteraction",tag:"mBindTagID",generalType:"generalType",otherAttrs:"otherAttrs"},y=[new e("mLayerOffsetX",4),new e("mLayerOffsetY",4),new e("tileBoxClass",4),new e("scalerX",4),new e("scalerY",4),new e("MovingX",4),new e("MovingY",4),new e("rotateAngle",4),new e("shearAngleX",4),new e("shearAngleY",4),new e("projectX",4),new e("projectY",4),new e("mWidth",4),new e("mHeight",4),new e("mValidSubLayer",4),new e("mHidden",4)],D={},i=0;i<y.length;i++){var d=y[i];d.index=i,D[d.name]=d}console.log("layerAttrTable",D);for(var g={x:"x",y:"y",width:"mWidth",height:"mHeight",hidden:"mHidden"},m={roi:"SubLayerClassROI",font:"SubLayerClassFont",texture:"SubLayerClassImage",color:"SubLayerClassColor"},p={SubLayerClassROI:new e("SubLayerClassROI",16,0),SubLayerClassFont:new e("SubLayerClassFOnt",8,1),SubLayerClassImage:new e("SubLayerClassImage",4,2),SubLayerClassColor:new e("SubLayerClassColor",4,3)},b=["p1x","p1y","p2x","p2y","p3x","p3y","p4x","p4y","p5x","p5y","p6x","p6y","p7x","p7y","p8x","p8y"],f={},i=0;i<b.length;i++)f[b[i]]=new e(b[i],1,i);var h={fontStyle:new e("fontStyle",4,0),text:new e("text",4,1)},V={texture:new e("texture",4,0)},F={r:new e("r",1,0),g:new e("g",1,1),b:new e("b",1,2),a:new e("a",1,3)};({OPEND:new n("OPEND",new a(7,(!0))),OPSTART:new n("OPSTART",new a(1),new a(2),new a(4,(!0))),OPSETLAY:new n("OPSETLAY",new a(1),new a(2),new a(4)),OPSETLAYTE:new n("OPSETLAYTE",new a(1),new a(1),new a(1,(!0)),new a(4)),OPGETLAY:new n("OPGETLAY",new a(1),new a(1),new a(1),new a(4,(!0))),OPGETLAYTE:new n("OPGETLAYTE",new a(1),new a(1),new a(1),new a(3,(!0))),OPSETSUBLAY:new n("OPSETSUBLAY",new a(1),new a(1),new a(1),new a(4)),OPSETSUBLAYTE:new n("OPSETSUBLAYTE",new a(1),new a(1),new a(1),new a(4)),OPGETSUBLAY:new n("OPGETSUBLAY",new a(1),new a(1),new a(1),new a(1),new a(3,(!0))),OPGETSUBLAYTE:new n("OPGETSUBLAYTE",new a(1),new a(1),new a(1),new a(1),new a(3,(!0))),OPSETTEMP:new n("OPSETTEMP",new a(1),new a(2,(!0)),new a(4)),OPGETTEMP:new n("OPGETTEMP",new a(1),new a(1),new a(5,(!0))),OPGETTAG:new n("OPGETTAG",new a(1),new a(6,(!0))),OPSETTAGIM:new n("OPSETTAGIM",new a(3,(!0)),new a(4)),OPSETTAGTE:new n("OPSETTAGTE",new a(1),new a(6,(!0))),OPEQIM:new n("OPEQIM",new a(1),new a(2,(!0)),new a(4)),OPEQTE:new n("OPEQTE",new a(1),new a(1),new n(5,(!0))),OPGTIM:new n("OPGTIM",new a(1),new a(2,(!0)),new a(4)),OPGTTE:new n("OPGTTE",new a(1),new a(1),new n(5,(!0))),OPGTEIM:new n("OPGTEIM",new a(1),new a(2,(!0)),new a(4)),OPGTETE:new n("OPGTETE",new a(1),new a(1),new n(5,(!0))),OPLTIM:new n("OPLTIM",new a(1),new a(2,(!0)),new a(4)),OPLTTE:new n("OPLTTE",new a(1),new a(1),new n(5,(!0))),OPLTEIM:new n("OPLTEIM",new a(1),new a(2,(!0)),new a(4)),OPLTETE:new n("OPLTETE",new a(1),new a(1),new n(5,(!0))),OPJUMP:new n("OPJUMP",new a(5,(!0)),new a(2)),OPADDIM:new n("OPADDIM",new a(1),new a(2,(!0)),new a(4)),OPMINUSIM:new n("OPMINUSIM",new a(1),new a(2,(!0)),new a(4)),OPMULIM:new n("OPMULIM",new a(1),new a(2,(!0)),new a(4)),OPDIVIM:new n("OPDIVIM",new a(1),new a(2,(!0)),new a(4)),OPMODIM:new n("OPMODIM",new a(1),new a(2,(!0)),new a(4)),OPADDTE:new n("OPADDTE",new a(1),new a(1),new a(5,(!0))),OPMINUSTE:new n("OPMINUSTE",new a(1),new a(1),new a(5,(!0))),OPMULTE:new n("OPMULTE",new a(1),new a(1),new a(5,(!0))),OPDIVTE:new n("OPDIVTE",new a(1),new a(1),new a(5,(!0))),OPMODTE:new n("OPMODTE",new a(1),new a(1),new a(5,(!0))),OPANDIM:new n("OPANDIM",new a(1),new a(2,(!0)),new a(4)),OPORIM:new n("OPORIM",new a(1),new a(2,(!0)),new a(4)),OPXORIM:new n("OPXORIM",new a(1),new a(2,(!0)),new a(4)),OPNOTIM:new n("OPNOTIM",new a(1),new a(6,(!0))),OPANDTE:new n("OPANDTE",new a(1),new a(1),new a(5,(!0))),OPORTE:new n("OPORTE",new a(1),new a(1),new a(5,(!0))),OPXORTE:new n("OPXORTE",new a(1),new a(1),new a(5,(!0))),OPNOTTE:new n("OPNOTTE",new a(1),new a(1),new a(5,(!0))),OPSETWIDIM:new n("OPSETWIDIM",new a(1),new a(2,(!0)),new a(4)),OPSETWIDTE:new n("OPSETWIDTE",new a(1),new a(1),new a(5,(!0))),OPGETWIDTE:new n("OPGETWIDTE",new a(1),new a(1),new a(5,(!0))),OPSETWIDOFFSETIM:new n("OPSETWIDOFFSETIM",new a(1),new a(2,(!0)),new a(4)),OPSETWIDOFFSETTE:new n("OPSETWIDOFFSETTE",new a(1),new a(1),new a(5,(!0))),OPGETWIDOFFSET:new n("OPGETWIDOFFSET",new a(1),new a(1),new a(5)),OPSETLAYOFFSETIM:new n("OPSETLAYOFFSETIM",new a(1),new a(1),new a(1,(!0)),new a(4)),OPSETLAYOFFSETTE:new n("OPSETLAYOFFSETTE",new a(1),new a(1),new a(1),new a(4,(!0))),OPGETLAYOFFSET:new n("OPGETLAYOFFSET",new a(1),new a(1),new a(1),new a(4,(!0))),OPNOP:new n("OPNOP",new a(7,(!0)))});return r.transJSWidgetCommandToCPPForm=u,r.transJSWidgetCommands=s,r});