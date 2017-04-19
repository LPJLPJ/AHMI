!function(e){if("function"==typeof define&&define.amd)define("WidgetModel",["./layer"],e);else if("object"==typeof module&&module.exports){console.log(__dirpath);var n=require("./layer");module.exports=e(n)}else window.WidgetModel=e(window.LayerModel)}(function(e){function n(e,n,t,s,r){this.info={left:e,top:n,width:t,height:s},this.tag="defaultTag",this.type="general",this.mode=0,r&&r.length?this.layers=r:this.layers=[new o(t,s)]}function t(e,n){this.type=e,this.value=n}function s(e){var n=[],t={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))n=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),t={r:n[0],g:n[1],b:n[2],a:255*n[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);n=e.split(/[\(|\)]/)[1].split(","),t={r:n[0],g:n[1],b:n[2],a:255}}return t}function r(e,t,r,a,i,l,u){var c,d=new o(0,0,r,a);d.subLayers.font=new w(i,l),d.subLayers.image=new p(u[0].imgSrc),c=s(u[0].color),d.subLayers.color=new h(c);var g=new o(0,0,r,a);g.subLayers.font=new w(i,l),g.subLayers.image=new p(u[1].imgSrc),c=s(u[1].color),g.subLayers.color=new h(c);var m=[d,g];this.subType="Button",n.call(this,e,t,r,a,m)}function a(e,t,r,a,i,w,l,u){var c,d=0,g=0,m=[];if(0==w){d=(r-(i-1)*l)/i,g=a;for(var y=0;y<i;y++){var f=new o(y*(d+l),0,d,g);f.subLayers.image=new p(u[2*y].imgSrc),c=s(u[2*y].color),f.subLayers.color=new h(c);var b=new o(y*(d+l),0,d,g,!0);b.subLayers.image=new p(u[2*y+1].imgSrc),c=s(u[2*y+1].color),b.subLayers.color=new h(c),m.push(f),m.push(b)}}this.subType="ButtonGroup",n.call(this,e,t,r,a,m)}function i(e,t,r,a,i,w){var l,u=new o(0,0,r,t),c=new o(0,0,r,t),d=new o(0,0,r,t);l=s(w[0].color),u.subLayers.color=new h(l),u.subLayers.image=new p(w[0].imgSrc),l=s(w[1].color),c.subLayers.color=new h(l),c.subLayers.image=new p(w[1].imgSrc),"1"==i&&(d.subLayers.image=new p(w[2].imgSrc));var g=[u,c,d];this.subType="Progress",n.call(this,e,t,r,a,g)}var o=e.Layer,w=(e.ROISubLayer,e.FontSubLayer),p=e.TextureSubLayer,h=e.ColorSubLayer;n.prototype.toObject=function(){return{info:{left:this.info.left,top:this.info.top,width:this.info.width,height:this.info.height},mode:this.mode,tag:this.tag,layers:this.layers}},n.prototype.commands={},n.execute=function(e,n,t){return"__tag"==n?this.getTag(e.tag):"string"==typeof n?'"'+n+'"':n};var l="Int",u="ID",c="EXP";r.prototype=Object.create(n.prototype),r.prototype.constructor=r,r.prototype.commands={},r.prototype.commands.onInitialize=[["temp","a",new t(c,"this.mode")],["setTag",new t(l,1)],["set",new t(u,"a"),new t(l,3)],["if"],["gte",new t(u,"a"),new t(l,100)],["set",new t(c,"this.layers.1.hidden"),new t(l,1)],["else"],["set",new t(c,"this.layers.1.hidden"),new t(l,0)],["end"]],r.prototype.commands.onMouseDown=[["temp","b",new t(c,"this.mode")],["print",new t(u,"b")],["if"],["eq",new t(u,"b"),new t(l,0)],["set",new t(c,"this.layers.0.hidden"),new t(l,1)],["set",new t(c,"this.layers.1.hidden"),new t(l,0)],["setTag",new t(l,0)],["else"],["temp","c",new t(l,0)],["getTag","c"],["if"],["gt",new t(u,"c"),new t(l,0)],["setTag",new t(l,0)],["else"],["setTag",new t(l,1)],["end"],["end"]],r.prototype.commands.onMouseUp=[["temp","b",new t(c,"this.mode")],["if"],["eq",new t(u,"b"),new t(l,0)],["set",new t(c,"this.layers.0.hidden"),new t(l,0)],["set",new t(c,"this.layers.1.hidden"),new t(l,1)],["setTag",new t(l,12)],["end"]],r.prototype.commands.onTagChange=[["temp","a",new t(l,0)],["temp","b",new t(c,"this.mode")],["getTag","a"],["if"],["eq",new t(u,"b"),new t(l,1)],["if"],["gt",new t(u,"a"),new t(l,0)],["set",new t(c,"this.layers.0.hidden"),new t(l,1)],["set",new t(c,"this.layers.1.hidden"),new t(l,0)],["else"],["set",new t(c,"this.layers.0.hidden"),new t(l,0)],["set",new t(c,"this.layers.1.hidden"),new t(l,1)],["end"],["end"]],a.prototype=Object.create(n.prototype),a.prototype.constructor=a,a.prototype.commands.onInitialize=[],a.prototype.commands.onMouseDown=[["temp","a",new t(l,0)],["temp","b",new t(l,0)],["temp","c",new t(l,0)],["set",new t(u,"c"),new t(c,"this.layers.length")],["minus","c",new t(l,2)],["set",new t(u,"a"),new t(c,"this.innerX")],["set",new t(u,"b"),new t(c,"this.innerY")],["temp","lx",new t(l,0)],["temp","ly",new t(l,0)],["temp","lw",new t(l,0)],["temp","lh",new t(l,0)],["temp","rx",new t(l,0)],["temp","ry",new t(l,0)],["while"],["gte",new t(u,"c"),new t(l,0)],["set",new t(u,"lx"),new t(c,"this.layers.c.x")],["set",new t(u,"ly"),new t(c,"this.layers.c.y")],["set",new t(u,"lw"),new t(c,"this.layers.c.width")],["set",new t(u,"lh"),new t(c,"this.layers.c.height")],["set",new t(u,"rx"),new t(u,"lx")],["set",new t(u,"ry"),new t(u,"ly")],["add","rx",new t(u,"lw")],["add","ry",new t(u,"lh")],["if"],["gte",new t(u,"a"),new t(u,"lx")],["if"],["gt",new t(u,"rx"),new t(u,"a")],["if"],["gte",new t(u,"b"),new t(u,"ly")],["if"],["gt",new t(u,"ry"),new t(u,"b")],["print",new t(u,"c"),"hit"],["divide","c",new t(l,2)],["setTag",new t(u,"c")],["set",new t(u,"c"),new t(l,0)],["end"],["end"],["end"],["end"],["minus","c",new t(l,2)],["end"]],a.prototype.commands.onMouseUp=[],a.prototype.commands.onTagChange=[["temp","a",new t(l,0)],["temp","b",new t(l,0)],["temp","c",new t(l,0)],["set",new t(u,"a"),new t(c,"this.layers.length")],["set",new t(u,"c"),new t(u,"a")],["divide","c",new t(l,2)],["while"],["gt",new t(u,"a"),new t(l,0)],["minus","a",new t(l,1)],["print",new t(u,"a")],["set",new t(c,"this.layers.a.hidden"),new t(l,1)],["minus","a",new t(l,1)],["set",new t(c,"this.layers.a.hidden"),new t(l,0)],["end"],["getTag","a"],["print",new t(u,"a")],["if"],["gte",new t(u,"a"),new t(l,0)],["if"],["gt",new t(u,"c"),new t(u,"a")],["multiply","a",new t(l,2)],["set",new t(c,"this.layers.a.hidden"),new t(l,1)],["add","a",new t(l,1)],["set",new t(c,"this.layers.a.hidden"),new t(l,0)],["end"],["end"]],i.prototype=Object.create(n.prototype),i.prototype.constructor=i,i.prototype.commands.onInitialize=[["temp","a",new t(l,0)]],i.prototype.commands.onMouseDown=[["temp","a",new t(l,0)]],i.prototype.commands.onMouseUp=[["temp","a",new t(l,0)]],i.prototype.commands.onTagChange=[["temp","a",new t(l,0)]];var d={},g={};d.transCommand=function(e,t){var s,r,a,i=t[0];switch(i){case"temp":r=t[1],a=n.execute(e,t[2]),g[r]=a,s="var "+r+"="+a+";\n";break;case"set":r=t[1],a=n.execute(e,t[2]),r in g&&(g[r]=a),s=r+"="+a+";\n";break;case"if":s="if";break;case"pred":var o=t[2],w=t[3];o in g||(o=n.execute(e,o)),w in g||(w=n.execute(e,w)),s="("+o+t[1]+w+"){\n";break;case"else":s="}else{\n";break;case"end":s="}\n";break;case"setTag":s='WidgetExecutor.setTag("'+e.tag+'",'+t[1]+")"}return s},d.transFunction=function(e,n){g={};for(var t="",s=0;s<n.length;s++)t+=this.transCommand(e,n[s]);return t},d.complier={},function(e){"use strict";function n(e){for(var t=[],s=!0;e.length&&s;){var r,a=e[0];switch(a[0]){case"if":r={},r.type="IF",r.args=[],e.shift(),r.args.push(e.shift()),r.args.push(n(e)),"else"===e[0][0]&&(e.shift(),r.args.push(n(e))),e.shift(),t.push(r);break;case"while":r={type:"WHILE",args:[]},e.shift(),r.args.push(e.shift()),r.args.push(n(e)),e.shift(),t.push(r);break;case"else":case"end":s=!1;break;default:t.push({type:"EXP",args:[a]}),e.shift()}}return t}function t(e,n){this.label=String(e),this.cmd=n}function s(e,n){h=0;var t=a(e,n);return r(t),t}function r(e){for(var n,t={},s=0;s<e.length;s++)n=e[s],""!==n.label&&(t[n.label]=s);for(s=0;s<e.length;s++){n=e[s];var r=n.cmd;if("jump"===r[0]){var a=t[r[2]];r[2]=a-s}}}function a(e,n){for(var s=[],r=0;r<e.length;r++){var a=e[r];switch(a.type){case"EXP":s.push(new t("",a.args[0]));break;case"IF":[].push.apply(s,i(a,n));break;case"WHILE":[].push.apply(s,o(a,n));break;default:s.push(new t("",a.args[0]))}}return s}function i(e,n){var s=[],r=e.args;2===r.length&&r.push([]);var i=r[0],o=r[2],w=r[1];if(n=n||!1){var p=i[0],g=l[p];g&&(i[0]=g,o=r[1],w=r[2])}s.push(new t("",i));var m=h;h+=1,s.push(new t("",[u,d,m])),[].push.apply(s,a(w,n));var y=h;h+=1,s.push(new t("",[u,d,y]));var f=a(o,n);return f.length>0?f[0].label=String(m):f.push(new t(m,[c,"",""])),[].push.apply(s,f),s.push(new t(y,[c,"",""])),s}function o(e,n){var s=[],r=e.args,i=r[0],o=r[1],w=h++,p=h++,g=h++;if(n){var m=l[i[0]];m?(i[0]=m,s.push(new t(w,i)),s.push(new t("",[u,d,p])),s.push(new t("",[u,d,g]))):(s.push(new t(w,i)),s.push(new t("",[u,d,g])),s.push(new t("",[u,d,p])))}var y=a(o,n);return y.push(new t("",[u,d,w])),y[0].label=String(p),[].push.apply(s,y),s.push(new t(g,[c,"",""])),s}var w={};w.parse=n;var p={},h=0,l={gte:"lt",lte:"gt"};p.trans=s;var u="jump",c="end",d="";e.parser=w,e.transformer=p}(d.complier);var m={};return m.models={},m.models.Button=r,m.models.ButtonGroup=a,m.models.Progress=i,m.Widget=n,m.WidgetCommandParser=d,m});