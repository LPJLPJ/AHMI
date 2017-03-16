!function(e){if("function"==typeof define&&define.amd)define("WidgetModel",["./layer"],e);else if("object"==typeof module&&module.exports){console.log(__dirpath);var t=require("./layer");module.exports=e(t)}else window.WidgetModel=e(window.LayerModel)}(function(e){function t(e,t,n,s,a){this.info={left:e,top:t,width:n,height:s},this.tag="defaultTag",this.type="general",this.mode=0,a&&a.length?this.layers=a:this.layers=[new r(n,s)]}function n(e,t){this.type=e,this.value=t}function s(e,n,s,h,u,p,l){var w=new r(s,h);w.subLayers.font=new a(0,0,s,h,u,p),w.subLayers.texture=new i(0,0,s,h,l[0].imgSrc),w.subLayers.color=new o(0,0,s,h,l[0].color);var d=new r(s,h);d.subLayers.font=new a(0,0,s,h,u,p),d.subLayers.texture=new i(0,0,s,h,l[1].imgSrc),d.subLayers.color=new o(0,0,s,h,l[1].color);var c=[w,d];this.subType="Button",t.call(this,e,n,s,h,c)}var r=e.Layer,a=(e.ROISubLayer,e.FontSubLayer),i=e.TextureSubLayer,o=e.ColorSubLayer;t.prototype.toObject=function(){return{info:{left:this.info.left,top:this.info.top,width:this.info.width,height:this.info.height},mode:this.mode,tag:this.tag,layers:this.layers}},t.prototype.commands={},t.execute=function(e,t,n){return"__tag"==t?this.getTag(e.tag):"string"==typeof t?'"'+t+'"':t};var h="Int",u="ID",p="EXP";s.prototype=Object.create(t.prototype),s.prototype.constructor=s,s.prototype.commands={},s.prototype.commands.onInitialize=[["temp","a",new n(p,"this.mode")],["setTag",new n(h,1)],["set",new n(u,"a"),new n(h,3)],["if"],["gte",new n(u,"a"),new n(h,100)],["set",new n(p,"this.layers.1.hidden"),new n(h,1)],["else"],["set",new n(p,"this.layers.1.hidden"),new n(h,0)],["end"]],s.prototype.commands.onMouseDown=[["temp","b",new n(p,"this.mode")],["if"],["eq",new n(u,"b"),new n(h,0)],["set",new n(p,"this.layers.0.hidden"),new n(h,1)],["set",new n(p,"this.layers.1.hidden"),new n(h,0)],["setTag",new n(h,101)],["else"],["temp","c",new n(h,0)],["getTag","c"],["if"],["gt",new n(u,"c"),new n(h,0)],["set",new n(p,"this.layers.0.hidden"),new n(h,1)],["set",new n(p,"this.layers.1.hidden"),new n(h,0)],["setTag",new n(h,0)],["else"],["set",new n(p,"this.layers.0.hidden"),new n(h,0)],["set",new n(p,"this.layers.1.hidden"),new n(h,1)],["setTag",new n(h,1)],["end"],["end"]],s.prototype.commands.onMouseUp=[["temp","b",new n(p,"this.mode")],["if"],["eq",new n(u,"b"),new n(h,0)],["set",new n(p,"this.layers.0.hidden"),new n(h,0)],["set",new n(p,"this.layers.1.hidden"),new n(h,1)],["setTag",new n(h,12)],["end"]];var l={},w={};l.transCommand=function(e,n){var s,r,a,i=n[0];switch(i){case"temp":r=n[1],a=t.execute(e,n[2]),w[r]=a,s="var "+r+"="+a+";\n";break;case"set":r=n[1],a=t.execute(e,n[2]),r in w&&(w[r]=a),s=r+"="+a+";\n";break;case"if":s="if";break;case"pred":var o=n[2],h=n[3];o in w||(o=t.execute(e,o)),h in w||(h=t.execute(e,h)),s="("+o+n[1]+h+"){\n";break;case"else":s="}else{\n";break;case"end":s="}\n";break;case"setTag":s='WidgetExecutor.setTag("'+e.tag+'",'+n[1]+")"}return s},l.transFunction=function(e,t){w={};for(var n="",s=0;s<t.length;s++)n+=this.transCommand(e,t[s]);return n},l.complier={},function(e){"use strict";function t(e){for(var n=[],s=!0;e.length&&s;){var r,a=e[0];switch(a[0]){case"if":r={},r.type="IF",r.args=[],e.shift(),r.args.push(e.shift()),r.args.push(t(e)),"else"===e[0][0]&&(e.shift(),r.args.push(t(e))),e.shift(),n.push(r);break;case"while":r={type:"WHILE",args:[]},e.shift(),r.args.push(e.shift()),r.args.push(t(e)),e.shift(),n.push(r);break;case"else":case"end":s=!1;break;default:n.push({type:"EXP",args:[a]}),e.shift()}}return n}function n(e,t){this.label=String(e),this.cmd=t}function s(e,t){var n=a(e,t);return r(n),n}function r(e){for(var t,n={},s=0;s<e.length;s++)t=e[s],""!==t.label&&(n[t.label]=s);for(s=0;s<e.length;s++){t=e[s];var r=t.cmd;if("jump"===r[0]){var a=n[r[2]];r[2]=a-s}}}function a(e,t){for(var s=[],r=0;r<e.length;r++){var a=e[r];switch(a.type){case"EXP":s.push(new n("",a.args[0]));break;case"IF":[].push.apply(s,i(a,t));break;case"WHILE":[].push.apply(s,o(a,t));break;default:s.push(new n("",a.args[0]))}}return s}function i(e,t){var s=[],r=e.args;2===r.length&&r.push([]);var i=r[0],o=r[2],h=r[1];if(t=t||!1){var u=i[0],f=l[u];f&&(i[0]=f,o=r[1],h=r[2])}s.push(new n("",i));var g=p;p+=1,s.push(new n("",[w,c,g])),[].push.apply(s,a(h,t));var y=p;p+=1,s.push(new n("",[w,c,y]));var m=a(o,t);return m.length>0?m[0].label=String(g):m.push(new n(g,[d,"",""])),[].push.apply(s,m),s.push(new n(y,[d,"",""])),s}function o(e,t){var s=[],r=e.args,i=r[0],o=r[1],h=p++,u=p++,f=p++;if(t){var g=l[i[0]];g?(i[0]=g,s.push(new n(h,i)),s.push(new n("",[w,c,u])),s.push(new n("",[w,c,f]))):(s.push(new n(h,i)),s.push(new n("",[w,c,f])),s.push(new n("",[w,c,u])))}var y=a(o,t);return y.push(new n("",[w,c,h])),y[0].label=String(u),[].push.apply(s,y),s.push(new n(f,[d,"",""])),s}var h={};h.parse=t;var u={},p=0,l={gte:"lt",lte:"gt"};u.trans=s;var w="jump",d="end",c="";e.parser=h,e.transformer=u}(l.complier);var d={};return d.models={},d.models.Button=s,d.Widget=t,d.WidgetCommandParser=l,d});