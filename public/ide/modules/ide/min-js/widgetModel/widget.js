!function(e){if("function"==typeof define&&define.amd)define("WidgetModel",["./layer"],e);else if("object"==typeof module&&module.exports){console.log(__dirpath);var t=require("./layer");module.exports=e(t)}else window.WidgetModel=e(window.LayerModel)}(function(e){function t(e,t,r,n,s){this.info={left:e,top:t,width:r,height:n},this.tag="defaultTag",this.type="general",this.mode=0,this.otherAttrs=[],s&&s.length?this.layers=s:this.layers=[new d(r,n)]}function r(e,t){this.type=e,this.value=t}function n(e){var t=[],r={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),r={r:t[0],g:t[1],b:t[2],a:255*t[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);t=e.split(/[\(|\)]/)[1].split(","),r={r:t[0],g:t[1],b:t[2],a:255}}return r}function s(e,r,s,o,a,i,w,c){var u,p=new d(0,0,s,o);p.subLayers.font=new f(a,i),p.subLayers.image=new L(w[0].imgSrc),u=n(w[0].color),p.subLayers.color=new v(u);var l=new d(0,0,s,o);l.subLayers.font=new f(a,i),l.subLayers.image=new L(w[1].imgSrc),u=n(w[1].color),l.subLayers.color=new v(u);var h,y=[l,p];c&&(h=new d(0,0,s,o),h.subLayers.image=new L(w[2].imgSrc),u=n(w[2].color),h.subLayers.color=new v(u),h.hidden=!0,y.push(h),this.enableHighLight=!0,this.maxHighLightNum=1),this.subType="Button",t.call(this,e,r,s,o,y)}function o(e,r,s,o,a,i,w,c,u){var p,l=0,h=0,y=[];if(0==i)if(l=(s-(a-1)*w)/a,h=o,u){for(var g=0;g<a;g++){var m=new d(g*(l+w),0,l,h);m.subLayers.image=new L(c[3*g].imgSrc),p=n(c[3*g].color),m.subLayers.color=new v(p);var b=new d(g*(l+w),0,l,h,!0);b.subLayers.image=new L(c[3*g+1].imgSrc),p=n(c[3*g+1].color),b.subLayers.color=new v(p);var f=new d(g*(l+w),0,l,h,!0);f.subLayers.image=new L(c[3*g+2].imgSrc),p=n(c[3*g+2].color),f.subLayers.color=new v(p),y.push(b),y.push(m),y.push(f)}this.enableHighLight=!0,this.maxHighLightNum=a}else for(var g=0;g<a;g++){var m=new d(g*(l+w),0,l,h);m.subLayers.image=new L(c[2*g].imgSrc),p=n(c[2*g].color),m.subLayers.color=new v(p);var b=new d(g*(l+w),0,l,h,!0);b.subLayers.image=new L(c[2*g+1].imgSrc),p=n(c[2*g+1].color),b.subLayers.color=new v(p),y.push(b),y.push(m)}this.subType="ButtonGroup",t.call(this,e,r,s,o,y)}function a(e,r,s,o,a,i,w){w=w||{};var c,u,p,l,h=[];if(0==a){c=[i[0].slices[0],i[1].slices[0]],u=new d(0,0,s,o),u.subLayers.image=new L(c[0].imgSrc),u.subLayers.color=new v(n(c[0].color));var y=w.pointerLength/Math.sqrt(2);p=new d(s/2,o/2,y,y),p.subLayers.image=new L(c[1].imgSrc),p.subLayers.color=new v(n(c[1].color)),h.push(u),h.push(p)}else if(1==a){c=[i[0].slices[0],i[1].slices[0],i[2].slices[0]],u=new d(0,0,s,o),u.subLayers.image=new L(c[0].imgSrc),u.subLayers.color=new v(n(c[0].color)),l=new d(0,0,s,o),l.subLayers.image=new L(c[2].imgSrc),l.subLayers.color=new v(n(c[2].color)),l.subLayers.roi=new b(1);var y=w.pointerLength/Math.sqrt(2);p=new d(s/2,o/2,y,y),p.subLayers.image=new L(c[1].imgSrc),p.subLayers.color=new v(n(c[1].color)),h.push(u),h.push(p),h.push(l)}else 2==a&&(c=[i[0].slices[0]],l=new d(0,0,s,o),l.subLayers.image=new L(c[0].imgSrc),l.subLayers.color=new v(n(c[0].color)),l.subLayers.roi=new b(1),h.push(l));t.call(this,e,r,s,o,h)}function i(e,r,s,o,a){var i,w=[];i=new d(0,0,s,o),i.subLayers.image=new L(a.imgSrc),i.subLayers.color=new v(n(a.color)),w.push(i),t.call(this,e,r,s,o,w)}function w(e,r,s,o,a,i,w){var c,u=[];c=new d(0,0,s,o),c.subLayers.font=new f(a,i),c.subLayers.image=new L(w.imgSrc),c.subLayers.color=new v(n(w.color)),u.push(c),t.call(this,e,r,s,o,u)}function c(e,r,n,s){var o=[];t.call(this,e,r,n,s,o)}function u(e,r,s,o,a){var i,w=[];i=new d(0,0,s,o),i.subLayers.image=new L(a.imgSrc),i.subLayers.color=new v(n(a.color)),w.push(i),t.call(this,e,r,s,o,w)}function p(e,r,n,s,o,a){var i,w,c=[];i=0!=o.symbolMode;var u=o.maxFontWidth;if(u){var p=o.decimalCount,l=o.numOfDigits,h=0;i&&(w=new d(0,0,u,s),w.subLayers.font=new f("+",a),c.push(w),h+=u);for(var y,g=0;g<l-p;g++)y=new d(h,0,u,s),y.subLayers.font=new f("0",a),c.push(y),h+=u;if(p>0){var m=new d(h,0,.5*u,s);m.subLayers.font=new f(".",a),c.push(m),h+=.5*u;for(var g=0;g<p;g++)y=new d(h,0,u,s),y.subLayers.font=new f("0",a),c.push(y),h+=u}t.call(this,e,r,n,s,c)}}function l(e,r,s,o,a,i,w){var c,u,p=[];c=new d(0,0,s,o),c.subLayers.image=new L(w[0].imgSrc),c.subLayers.color=new v(n(w[0].color)),p.push(c);var l=i.w,h=i.h;l&&h&&(u="horizontal"==a?new d(0,-(h-o)/2,l,h):new d(-(l-s)/2,0,l,h),u.subLayers.image=new L(w[1].imgSrc),u.subLayers.color=new v(n(w[1].color)),p.push(u)),t.call(this,e,r,s,o,p)}function h(e,r,s,o,a,i){var w,c=new d(0,0,s,o),u=new d(0,0,s,o),p=new d(0,0,s,o),l=Number(a.progressModeId),h=Number(a.cursor),y=i.length;w=n(i[0].color),c.subLayers.color=new v(w),c.subLayers.image=new L(i[0].imgSrc),0==l?(w=n(i[1].color),u.subLayers.color=new v(w),u.subLayers.image=new L(i[1].imgSrc),u.subLayers.roi=new b(0)):1==l?(w=n(i[1].color),u.subLayers.color=new v(w)):3==l&&(w=n(i[1].color),u.subLayers.color=new v(w)),1==h&&(p.subLayers.image=new L(i[y-1].imgSrc));var g=[c,u,p];this.subType="Progress",t.call(this,e,r,s,o,g)}function y(e,r,s,o,a,i){var w=new d(0,0,s,o),c=n(i[0].color);w.subLayers.color=new v(c),w.subLayers.image=new L(i[0].imgSrc);var u=[w];this.subType="Switch",t.call(this,e,r,s,o,u)}function g(e,r,s,o,a,i){for(var w,c=[],u=0;u<i.length;u++)c[u]=new d(0,0,s,o),w=n(i[u].color),c[u].subLayers.color=new v(w),c[u].subLayers.image=new L(i[u].imgSrc);this.subType="Slide",t.call(this,e,r,s,o,c)}function m(e,r,n,s,o,a){var i=Number(o.dateTimeModeId),w=o.maxFontWidth,c=(o.highLight,0),u=[],p=0;if(0==i){p=8;for(var l=0;l<p;l++)u[l]=new d(c,0,n,s),u[l].subLayers.font=2==l||5==l?new f(":",a):new f("0",a),c+=w}else if(1==i){p=5;for(var l=0;l<p;l++)u[l]=new d(c,0,n,s),u[l].subLayers.font=2==l?new f(":",a):new f("0",a),c+=w}else if(2==i){p=10;for(var l=0;l<p;l++)u[l]=new d(c,0,n,s),u[l].subLayers.font=4==l||7==l?new f("/",a):new f("0",a),c+=w}else if(3==i){p=10;for(var l=0;l<p;l++)u[l]=new d(c,0,n,s),u[l].subLayers.font=4==l||7==l?new f("-",a):new f("0",a),c+=w}this.subType="Datetime",t.call(this,e,r,n,s,u)}var d=e.Layer,b=e.ROISubLayer,f=e.FontSubLayer,L=e.TextureSubLayer,v=e.ColorSubLayer;t.prototype.toObject=function(){return{info:{left:this.info.left,top:this.info.top,width:this.info.width,height:this.info.height},enableHighLight:this.enableHighLight||!1,highLightNum:0,maxHighLightNum:this.maxHighLightNum||0,mode:this.mode,tag:this.tag,layers:this.layers,otherAttrs:this.otherAttrs}},t.prototype.commands={},t.execute=function(e,t,r){return"__tag"==t?this.getTag(e.tag):"string"==typeof t?'"'+t+'"':t};var S="Int",x="ID",T="EXP";s.prototype=Object.create(t.prototype),s.prototype.constructor=s,s.prototype.commands={},s.prototype.commands.onInitialize=[["temp","a",new r(T,"this.mode")],["setTag",new r(S,1)],["set",new r(x,"a"),new r(S,3)],["if"],["gte",new r(x,"a"),new r(S,100)],["set",new r(T,"this.layers.1.hidden"),new r(S,1)],["else"],["set",new r(T,"this.layers.1.hidden"),new r(S,0)],["end"]],s.prototype.commands.onMouseDown=[["temp","b",new r(T,"this.mode")],["print",new r(x,"b")],["if"],["eq",new r(x,"b"),new r(S,0)],["set",new r(T,"this.layers.0.hidden"),new r(S,1)],["set",new r(T,"this.layers.1.hidden"),new r(S,0)],["setTag",new r(S,0)],["else"],["temp","c",new r(S,0)],["getTag","c"],["if"],["gt",new r(x,"c"),new r(S,0)],["setTag",new r(S,0)],["else"],["setTag",new r(S,1)],["end"],["end"]],s.prototype.commands.onMouseUp=[["temp","b",new r(T,"this.mode")],["if"],["eq",new r(x,"b"),new r(S,0)],["set",new r(T,"this.layers.0.hidden"),new r(S,0)],["set",new r(T,"this.layers.1.hidden"),new r(S,1)],["setTag",new r(S,12)],["end"]],s.prototype.commands.onTagChange=[["temp","a",new r(S,0)],["temp","b",new r(T,"this.mode")],["getTag","a"],["if"],["eq",new r(x,"b"),new r(S,1)],["if"],["gt",new r(x,"a"),new r(S,0)],["set",new r(T,"this.layers.0.hidden"),new r(S,1)],["set",new r(T,"this.layers.1.hidden"),new r(S,0)],["else"],["set",new r(T,"this.layers.0.hidden"),new r(S,0)],["set",new r(T,"this.layers.1.hidden"),new r(S,1)],["end"],["end"]],o.prototype=Object.create(t.prototype),o.prototype.constructor=o,o.prototype.commands.onInitialize=[],o.prototype.commands.onMouseDown=[["temp","a",new r(S,0)],["temp","b",new r(S,0)],["temp","c",new r(S,0)],["set",new r(x,"c"),new r(T,"this.layers.length")],["minus","c",new r(S,2)],["set",new r(x,"a"),new r(T,"this.innerX")],["set",new r(x,"b"),new r(T,"this.innerY")],["temp","lx",new r(S,0)],["temp","ly",new r(S,0)],["temp","lw",new r(S,0)],["temp","lh",new r(S,0)],["temp","rx",new r(S,0)],["temp","ry",new r(S,0)],["while"],["gte",new r(x,"c"),new r(S,0)],["set",new r(x,"lx"),new r(T,"this.layers.c.x")],["set",new r(x,"ly"),new r(T,"this.layers.c.y")],["set",new r(x,"lw"),new r(T,"this.layers.c.width")],["set",new r(x,"lh"),new r(T,"this.layers.c.height")],["set",new r(x,"rx"),new r(x,"lx")],["set",new r(x,"ry"),new r(x,"ly")],["add","rx",new r(x,"lw")],["add","ry",new r(x,"lh")],["if"],["gte",new r(x,"a"),new r(x,"lx")],["if"],["gt",new r(x,"rx"),new r(x,"a")],["if"],["gte",new r(x,"b"),new r(x,"ly")],["if"],["gt",new r(x,"ry"),new r(x,"b")],["print",new r(x,"c"),"hit"],["divide","c",new r(S,2)],["setTag",new r(x,"c")],["set",new r(x,"c"),new r(S,0)],["end"],["end"],["end"],["end"],["minus","c",new r(S,2)],["end"]],o.prototype.commands.onMouseUp=[],o.prototype.commands.onTagChange=[["temp","a",new r(S,0)],["temp","b",new r(S,0)],["temp","c",new r(S,0)],["set",new r(x,"a"),new r(T,"this.layers.length")],["set",new r(x,"c"),new r(x,"a")],["divide","c",new r(S,2)],["while"],["gt",new r(x,"a"),new r(S,0)],["minus","a",new r(S,1)],["print",new r(x,"a")],["set",new r(T,"this.layers.a.hidden"),new r(S,1)],["minus","a",new r(S,1)],["set",new r(T,"this.layers.a.hidden"),new r(S,0)],["end"],["getTag","a"],["print",new r(x,"a")],["if"],["gte",new r(x,"a"),new r(S,0)],["if"],["gt",new r(x,"c"),new r(x,"a")],["multiply","a",new r(S,2)],["set",new r(T,"this.layers.a.hidden"),new r(S,1)],["add","a",new r(S,1)],["set",new r(T,"this.layers.a.hidden"),new r(S,0)],["end"],["end"]],a.prototype=Object.create(t.prototype),a.prototype.constructor=a,i.prototype=Object.create(t.prototype),i.prototype.constructor=i,w.prototype=Object.create(t.prototype),w.prototype.constructor=w,c.prototype=Object.create(t.prototype),c.prototype.constructor=c,u.prototype=Object.create(t.prototype),u.prototype.constructor=u,p.prototype=Object.create(t.prototype),p.prototype.constructor=p,l.prototype=Object.create(t.prototype),l.prototype.constructor=l,h.prototype=Object.create(t.prototype),h.prototype.constructor=h,y.prototype=Object.create(t.prototype),y.prototype.constructor=y,g.prototype=Object.create(t.prototype),g.prototype.constructor=g,m.prototype=Object.create(t.prototype),m.prototype.constructor=m;var O={},j={};O.transCommand=function(e,r){var n,s,o,a=r[0];switch(a){case"temp":s=r[1],o=t.execute(e,r[2]),j[s]=o,n="var "+s+"="+o+";\n";break;case"set":s=r[1],o=t.execute(e,r[2]),s in j&&(j[s]=o),n=s+"="+o+";\n";break;case"if":n="if";break;case"pred":var i=r[2],w=r[3];i in j||(i=t.execute(e,i)),w in j||(w=t.execute(e,w)),n="("+i+r[1]+w+"){\n";break;case"else":n="}else{\n";break;case"end":n="}\n";break;case"setTag":n='WidgetExecutor.setTag("'+e.tag+'",'+r[1]+")"}return n},O.transFunction=function(e,t){j={};for(var r="",n=0;n<t.length;n++)r+=this.transCommand(e,t[n]);return r},O.complier={},function(e){"use strict";function t(e){for(var r=[],n=!0;e.length&&n;){var s,o=e[0];switch(o[0]){case"if":s={},s.type="IF",s.args=[],e.shift(),s.args.push(e.shift()),s.args.push(t(e)),"else"===e[0][0]&&(e.shift(),s.args.push(t(e))),e.shift(),r.push(s);break;case"while":s={type:"WHILE",args:[]},e.shift(),s.args.push(e.shift()),s.args.push(t(e)),e.shift(),r.push(s);break;case"else":case"end":n=!1;break;default:r.push({type:"EXP",args:[o]}),e.shift()}}return r}function r(e,t){this.label=String(e),this.cmd=t}function n(e,t){u=0;var r=o(e,t);return s(r),r}function s(e){for(var t,r={},n=0;n<e.length;n++)t=e[n],""!==t.label&&(r[t.label]=n);for(n=0;n<e.length;n++){t=e[n];var s=t.cmd;if("jump"===s[0]){var o=r[s[2]];s[2]=o-n}}}function o(e,t){for(var n=[],s=0;s<e.length;s++){var o=e[s];switch(o.type){case"EXP":n.push(new r("",o.args[0]));break;case"IF":[].push.apply(n,a(o,t));break;case"WHILE":[].push.apply(n,i(o,t));break;default:n.push(new r("",o.args[0]))}}return n}function a(e,t){var n=[],s=e.args;2===s.length&&s.push([]);var a=s[0],i=s[2],w=s[1];if(t=t||!1){var c=a[0],g=p[c];g&&(a[0]=g,i=s[1],w=s[2])}n.push(new r("",a));var m=u;u+=1,n.push(new r("",[l,y,m])),[].push.apply(n,o(w,t));var d=u;u+=1,n.push(new r("",[l,y,d]));var b=o(i,t);return b.length>0?b[0].label=String(m):b.push(new r(m,[h,"",""])),[].push.apply(n,b),n.push(new r(d,[h,"",""])),n}function i(e,t){var n=[],s=e.args,a=s[0],i=s[1],w=u++,c=u++,g=u++;if(t){var m=p[a[0]];m?(a[0]=m,n.push(new r(w,a)),n.push(new r("",[l,y,c])),n.push(new r("",[l,y,g]))):(n.push(new r(w,a)),n.push(new r("",[l,y,g])),n.push(new r("",[l,y,c])))}var d=o(i,t);return d.push(new r("",[l,y,w])),d[0].label=String(c),[].push.apply(n,d),n.push(new r(g,[h,"",""])),n}var w={};w.parse=t;var c={},u=0,p={gte:"lt",lte:"gt"};c.trans=n;var l="jump",h="end",y="";e.parser=w,e.transformer=c}(O.complier);var k={};return k.models={},k.models.Button=s,k.models.ButtonGroup=o,k.models.Dashboard=a,k.models.RotateImg=i,k.models.TextArea=w,k.models.Progress=h,k.models.Switch=y,k.models.ScriptTrigger=c,k.models.Video=u,k.models.Slide=g,k.models.Num=p,k.models.SlideBlock=l,k.models.DateTime=m,k.Widget=t,k.WidgetCommandParser=O,k});