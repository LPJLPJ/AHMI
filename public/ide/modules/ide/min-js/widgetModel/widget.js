!function(e){if("function"==typeof define&&define.amd)define("WidgetModel",["./layer"],e);else if("object"==typeof module&&module.exports){console.log(__dirpath);var t=require("./layer");module.exports=e(t)}else window.WidgetModel=e(window.LayerModel)}(function(e){function t(e,t,n,r,s){this.info={left:e,top:t,width:n,height:r},this.tag="defaultTag",this.type="general",this.mode=0,this.otherAttrs=[],s&&s.length?this.layers=s:this.layers=[new m(n,r)]}function n(e,t){this.type=e,this.value=t}function r(e){var t=[],n={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),n={r:t[0],g:t[1],b:t[2],a:255*t[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);t=e.split(/[\(|\)]/)[1].split(","),n={r:t[0],g:t[1],b:t[2],a:255}}return n}function s(e,n,s,o,a,i,w){var c,p=new m(0,0,s,o);p.subLayers.font=new f(a,i),p.subLayers.image=new b(w[0].imgSrc),c=r(w[0].color),p.subLayers.color=new v(c);var l=new m(0,0,s,o);l.subLayers.font=new f(a,i),l.subLayers.image=new b(w[1].imgSrc),c=r(w[1].color),l.subLayers.color=new v(c);var u=[l,p];this.subType="Button",t.call(this,e,n,s,o,u)}function o(e,n,s,o,a,i,w,c){var p,l=0,u=0,h=[];if(0==i){l=(s-(a-1)*w)/a,u=o;for(var y=0;y<a;y++){var d=new m(y*(l+w),0,l,u);d.subLayers.image=new b(c[2*y].imgSrc),p=r(c[2*y].color),d.subLayers.color=new v(p);var g=new m(y*(l+w),0,l,u,!0);g.subLayers.image=new b(c[2*y+1].imgSrc),p=r(c[2*y+1].color),g.subLayers.color=new v(p),h.push(g),h.push(d)}}this.subType="ButtonGroup",t.call(this,e,n,s,o,h)}function a(e,n,s,o,a,i,w){w=w||{};var c,p,l,u,h=[];if(0==a){c=[i[0].slices[0],i[1].slices[0]],p=new m(0,0,s,o),p.subLayers.image=new b(c[0].imgSrc),p.subLayers.color=new v(r(c[0].color));var y=w.pointerLength/Math.sqrt(2);l=new m(s/2,o/2,y,y),l.subLayers.image=new b(c[1].imgSrc),l.subLayers.color=new v(r(c[1].color)),h.push(p),h.push(l)}else if(1==a){c=[i[0].slices[0],i[1].slices[0],i[2].slices[0]],p=new m(0,0,s,o),p.subLayers.image=new b(c[0].imgSrc),p.subLayers.color=new v(r(c[0].color)),u=new m(0,0,s,o),u.subLayers.image=new b(c[2].imgSrc),u.subLayers.color=new v(r(c[2].color)),u.subLayers.roi=new g(1);var y=w.pointerLength/Math.sqrt(2);l=new m(s/2,o/2,y,y),l.subLayers.image=new b(c[1].imgSrc),l.subLayers.color=new v(r(c[1].color)),h.push(p),h.push(l),h.push(u)}else 2==a&&(c=[i[0].slices[0]],u=new m(0,0,s,o),u.subLayers.image=new b(c[0].imgSrc),u.subLayers.color=new v(r(c[0].color)),u.subLayers.roi=new g(1),h.push(u));t.call(this,e,n,s,o,h)}function i(e,n,s,o,a){var i,w=[];i=new m(0,0,s,o),i.subLayers.image=new b(a.imgSrc),i.subLayers.color=new v(r(a.color)),w.push(i),t.call(this,e,n,s,o,w)}function w(e,n,s,o,a,i,w){var c,p=[];c=new m(0,0,s,o),c.subLayers.font=new f(a,i),c.subLayers.image=new b(w.imgSrc),c.subLayers.color=new v(r(w.color)),p.push(c),t.call(this,e,n,s,o,p)}function c(e,n,r,s){var o=[];t.call(this,e,n,r,s,o)}function p(e,n,s,o,a){var i,w=[];i=new m(0,0,s,o),i.subLayers.image=new b(a.imgSrc),i.subLayers.color=new v(r(a.color)),w.push(i),t.call(this,e,n,s,o,w)}function l(e,n,r,s,o,a){var i,w,c=[];i=0!=o.symbolMode;var p=o.maxFontWidth;if(p){var l=o.decimalCount,u=o.numOfDigits,h=0;i&&(w=new m(0,0,p,s),w.subLayers.font=new f("+",a),c.push(w),h+=p);for(var y,d=0;d<u-l;d++)y=new m(h,0,p,s),y.subLayers.font=new f("0",a),c.push(y),h+=p;if(l>0){var g=new m(h,0,.5*p,s);g.subLayers.font=new f(".",a),c.push(g),h+=.5*p;for(var d=0;d<l;d++)y=new m(h,0,p,s),y.subLayers.font=new f("0",a),c.push(y),h+=p}t.call(this,e,n,r,s,c)}}function u(e,n,s,o,a,i){var w,c=new m(0,0,s,o),p=new m(0,0,s,o),l=new m(0,0,s,o),u=Number(a.progressModeId),h=Number(a.cursor),y=i.length;w=r(i[0].color),c.subLayers.color=new v(w),c.subLayers.image=new b(i[0].imgSrc),0==u?(w=r(i[1].color),p.subLayers.color=new v(w),p.subLayers.image=new b(i[1].imgSrc),p.subLayers.roi=new g(0)):1==u?(w=r(i[1].color),p.subLayers.color=new v(w)):3==u&&(w=r(i[1].color),p.subLayers.color=new v(w)),1==h&&(l.subLayers.image=new b(i[y-1].imgSrc));var d=[c,p,l];this.subType="Progress",t.call(this,e,n,s,o,d)}function h(e,n,s,o,a,i){var w=new m(0,0,s,o),c=r(i[0].color);w.subLayers.color=new v(c),w.subLayers.image=new b(i[0].imgSrc);var p=[w];this.subType="Switch",t.call(this,e,n,s,o,p)}function y(e,n,s,o,a,i){for(var w,c=[],p=0;p<i.length;p++)c[p]=new m(0,0,s,o),w=r(i[p].color),c[p].subLayers.color=new v(w),c[p].subLayers.image=new b(i[p].imgSrc);this.subType="Slide",t.call(this,e,n,s,o,c)}function d(e,n,r,s,o,a){var i=Number(o.dateTimeModeId),w=o.maxFontWidth,c=0,p=[];if(0==i)for(var l=0;l<8;l++)p[l]=new m(c,0,r,s),p[l].subLayers.font=2==l||5==l?new f(":",a):new f("0",a),c+=w;else if(1==i)for(var l=0;l<5;l++)p[l]=new m(c,0,r,s),p[l].subLayers.font=2==l?new f(":",a):new f("0",a),c+=w;else if(2==i)for(var l=0;l<10;l++)p[l]=new m(c,0,r,s),p[l].subLayers.font=4==l||7==l?new f("/",a):new f("0",a),c+=w;else if(3==i)for(var l=0;l<10;l++)p[l]=new m(c,0,r,s),p[l].subLayers.font=4==l||7==l?new f("-",a):new f("0",a),c+=w;this.subType="Slide",t.call(this,e,n,r,s,p)}var m=e.Layer,g=e.ROISubLayer,f=e.FontSubLayer,b=e.TextureSubLayer,v=e.ColorSubLayer;t.prototype.toObject=function(){return{info:{left:this.info.left,top:this.info.top,width:this.info.width,height:this.info.height},mode:this.mode,tag:this.tag,layers:this.layers,otherAttrs:this.otherAttrs}},t.prototype.commands={},t.execute=function(e,t,n){return"__tag"==t?this.getTag(e.tag):"string"==typeof t?'"'+t+'"':t};var L="Int",S="ID",T="EXP";s.prototype=Object.create(t.prototype),s.prototype.constructor=s,s.prototype.commands={},s.prototype.commands.onInitialize=[["temp","a",new n(T,"this.mode")],["setTag",new n(L,1)],["set",new n(S,"a"),new n(L,3)],["if"],["gte",new n(S,"a"),new n(L,100)],["set",new n(T,"this.layers.1.hidden"),new n(L,1)],["else"],["set",new n(T,"this.layers.1.hidden"),new n(L,0)],["end"]],s.prototype.commands.onMouseDown=[["temp","b",new n(T,"this.mode")],["print",new n(S,"b")],["if"],["eq",new n(S,"b"),new n(L,0)],["set",new n(T,"this.layers.0.hidden"),new n(L,1)],["set",new n(T,"this.layers.1.hidden"),new n(L,0)],["setTag",new n(L,0)],["else"],["temp","c",new n(L,0)],["getTag","c"],["if"],["gt",new n(S,"c"),new n(L,0)],["setTag",new n(L,0)],["else"],["setTag",new n(L,1)],["end"],["end"]],s.prototype.commands.onMouseUp=[["temp","b",new n(T,"this.mode")],["if"],["eq",new n(S,"b"),new n(L,0)],["set",new n(T,"this.layers.0.hidden"),new n(L,0)],["set",new n(T,"this.layers.1.hidden"),new n(L,1)],["setTag",new n(L,12)],["end"]],s.prototype.commands.onTagChange=[["temp","a",new n(L,0)],["temp","b",new n(T,"this.mode")],["getTag","a"],["if"],["eq",new n(S,"b"),new n(L,1)],["if"],["gt",new n(S,"a"),new n(L,0)],["set",new n(T,"this.layers.0.hidden"),new n(L,1)],["set",new n(T,"this.layers.1.hidden"),new n(L,0)],["else"],["set",new n(T,"this.layers.0.hidden"),new n(L,0)],["set",new n(T,"this.layers.1.hidden"),new n(L,1)],["end"],["end"]],o.prototype=Object.create(t.prototype),o.prototype.constructor=o,o.prototype.commands.onInitialize=[],o.prototype.commands.onMouseDown=[["temp","a",new n(L,0)],["temp","b",new n(L,0)],["temp","c",new n(L,0)],["set",new n(S,"c"),new n(T,"this.layers.length")],["minus","c",new n(L,2)],["set",new n(S,"a"),new n(T,"this.innerX")],["set",new n(S,"b"),new n(T,"this.innerY")],["temp","lx",new n(L,0)],["temp","ly",new n(L,0)],["temp","lw",new n(L,0)],["temp","lh",new n(L,0)],["temp","rx",new n(L,0)],["temp","ry",new n(L,0)],["while"],["gte",new n(S,"c"),new n(L,0)],["set",new n(S,"lx"),new n(T,"this.layers.c.x")],["set",new n(S,"ly"),new n(T,"this.layers.c.y")],["set",new n(S,"lw"),new n(T,"this.layers.c.width")],["set",new n(S,"lh"),new n(T,"this.layers.c.height")],["set",new n(S,"rx"),new n(S,"lx")],["set",new n(S,"ry"),new n(S,"ly")],["add","rx",new n(S,"lw")],["add","ry",new n(S,"lh")],["if"],["gte",new n(S,"a"),new n(S,"lx")],["if"],["gt",new n(S,"rx"),new n(S,"a")],["if"],["gte",new n(S,"b"),new n(S,"ly")],["if"],["gt",new n(S,"ry"),new n(S,"b")],["print",new n(S,"c"),"hit"],["divide","c",new n(L,2)],["setTag",new n(S,"c")],["set",new n(S,"c"),new n(L,0)],["end"],["end"],["end"],["end"],["minus","c",new n(L,2)],["end"]],o.prototype.commands.onMouseUp=[],o.prototype.commands.onTagChange=[["temp","a",new n(L,0)],["temp","b",new n(L,0)],["temp","c",new n(L,0)],["set",new n(S,"a"),new n(T,"this.layers.length")],["set",new n(S,"c"),new n(S,"a")],["divide","c",new n(L,2)],["while"],["gt",new n(S,"a"),new n(L,0)],["minus","a",new n(L,1)],["print",new n(S,"a")],["set",new n(T,"this.layers.a.hidden"),new n(L,1)],["minus","a",new n(L,1)],["set",new n(T,"this.layers.a.hidden"),new n(L,0)],["end"],["getTag","a"],["print",new n(S,"a")],["if"],["gte",new n(S,"a"),new n(L,0)],["if"],["gt",new n(S,"c"),new n(S,"a")],["multiply","a",new n(L,2)],["set",new n(T,"this.layers.a.hidden"),new n(L,1)],["add","a",new n(L,1)],["set",new n(T,"this.layers.a.hidden"),new n(L,0)],["end"],["end"]],a.prototype=Object.create(t.prototype),a.prototype.constructor=a,i.prototype=Object.create(t.prototype),i.prototype.constructor=i,w.prototype=Object.create(t.prototype),w.prototype.constructor=w,c.prototype=Object.create(t.prototype),c.prototype.constructor=c,p.prototype=Object.create(t.prototype),p.prototype.constructor=p,l.prototype=Object.create(t.prototype),l.prototype.constructor=l,u.prototype=Object.create(t.prototype),u.prototype.constructor=u,h.prototype=Object.create(t.prototype),h.prototype.constructor=h,y.prototype=Object.create(t.prototype),y.prototype.constructor=y,d.prototype=Object.create(t.prototype),d.prototype.constructor=d;var x={},O={};x.transCommand=function(e,n){var r,s,o,a=n[0];switch(a){case"temp":s=n[1],o=t.execute(e,n[2]),O[s]=o,r="var "+s+"="+o+";\n";break;case"set":s=n[1],o=t.execute(e,n[2]),s in O&&(O[s]=o),r=s+"="+o+";\n";break;case"if":r="if";break;case"pred":var i=n[2],w=n[3];i in O||(i=t.execute(e,i)),w in O||(w=t.execute(e,w)),r="("+i+n[1]+w+"){\n";break;case"else":r="}else{\n";break;case"end":r="}\n";break;case"setTag":r='WidgetExecutor.setTag("'+e.tag+'",'+n[1]+")"}return r},x.transFunction=function(e,t){O={};for(var n="",r=0;r<t.length;r++)n+=this.transCommand(e,t[r]);return n},x.complier={},function(e){"use strict";function t(e){for(var n=[],r=!0;e.length&&r;){var s,o=e[0];switch(o[0]){case"if":s={},s.type="IF",s.args=[],e.shift(),s.args.push(e.shift()),s.args.push(t(e)),"else"===e[0][0]&&(e.shift(),s.args.push(t(e))),e.shift(),n.push(s);break;case"while":s={type:"WHILE",args:[]},e.shift(),s.args.push(e.shift()),s.args.push(t(e)),e.shift(),n.push(s);break;case"else":case"end":r=!1;break;default:n.push({type:"EXP",args:[o]}),e.shift()}}return n}function n(e,t){this.label=String(e),this.cmd=t}function r(e,t){p=0;var n=o(e,t);return s(n),n}function s(e){for(var t,n={},r=0;r<e.length;r++)t=e[r],""!==t.label&&(n[t.label]=r);for(r=0;r<e.length;r++){t=e[r];var s=t.cmd;if("jump"===s[0]){var o=n[s[2]];s[2]=o-r}}}function o(e,t){for(var r=[],s=0;s<e.length;s++){var o=e[s];switch(o.type){case"EXP":r.push(new n("",o.args[0]));break;case"IF":[].push.apply(r,a(o,t));break;case"WHILE":[].push.apply(r,i(o,t));break;default:r.push(new n("",o.args[0]))}}return r}function a(e,t){var r=[],s=e.args;2===s.length&&s.push([]);var a=s[0],i=s[2],w=s[1];if(t=t||!1){var c=a[0],d=l[c];d&&(a[0]=d,i=s[1],w=s[2])}r.push(new n("",a));var m=p;p+=1,r.push(new n("",[u,y,m])),[].push.apply(r,o(w,t));var g=p;p+=1,r.push(new n("",[u,y,g]));var f=o(i,t);return f.length>0?f[0].label=String(m):f.push(new n(m,[h,"",""])),[].push.apply(r,f),r.push(new n(g,[h,"",""])),r}function i(e,t){var r=[],s=e.args,a=s[0],i=s[1],w=p++,c=p++,d=p++;if(t){var m=l[a[0]];m?(a[0]=m,r.push(new n(w,a)),r.push(new n("",[u,y,c])),r.push(new n("",[u,y,d]))):(r.push(new n(w,a)),r.push(new n("",[u,y,d])),r.push(new n("",[u,y,c])))}var g=o(i,t);return g.push(new n("",[u,y,w])),g[0].label=String(c),[].push.apply(r,g),r.push(new n(d,[h,"",""])),r}var w={};w.parse=t;var c={},p=0,l={gte:"lt",lte:"gt"};c.trans=r;var u="jump",h="end",y="";e.parser=w,e.transformer=c}(x.complier);var j={};return j.models={},j.models.Button=s,j.models.ButtonGroup=o,j.models.Dashboard=a,j.models.RotateImg=i,j.models.TextArea=w,j.models.Progress=u,j.models.Switch=h,j.models.ScriptTrigger=c,j.models.Video=p,j.models.Slide=y,j.models.Num=l,j.models.DateTime=d,j.Widget=t,j.WidgetCommandParser=x,j});