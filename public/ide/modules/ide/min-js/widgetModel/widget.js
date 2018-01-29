!function(e){if("function"==typeof define&&define.amd)define("WidgetModel",["./layer"],e);else if("object"==typeof module&&module.exports){console.log(__dirpath);var t=require("./layer");module.exports=e(t)}else window.WidgetModel=e(window.LayerModel)}(function(e){function t(e,t,r,s,n){this.info={left:e,top:t,width:r,height:s},this.tag="defaultTag",this.type="general",this.mode=0,this.otherAttrs=[],n&&n.length?this.layers=n:this.layers=[new S(r,s)]}function r(e,t){this.type=e,this.value=t}function s(e){var t=[],r={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),r={r:t[0],g:t[1],b:t[2],a:255*t[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);t=e.split(/[\(|\)]/)[1].split(","),r={r:t[0],g:t[1],b:t[2],a:255}}return r}function n(e,r,n,o,a,i,c,u){var h,w=new S(0,0,n,o);w.subLayers.font=new x(a,i),w.subLayers.image=new T([c[0].imgSrc]),h=s(c[0].color),w.subLayers.color=new O(h);var l=new S(0,0,n,o);l.subLayers.font=new x(a,i),l.subLayers.image=new T([c[1].imgSrc]),h=s(c[1].color),l.subLayers.color=new O(h);var p,y=[l,w];u&&(p=new S(0,0,n,o),p.subLayers.image=new T([c[2].imgSrc]),h=s(c[2].color),p.subLayers.color=new O(h),p.hidden=!0,y.push(p),this.enableHighLight=!0,this.maxHighLightNum=1),this.subType="Button",t.call(this,e,r,n,o,y)}function o(e,r,n,o,a,i,c,u,h){var w,l=0,p=0,y=[];if(0==i){l=(n-(a-1)*c)/a,p=o;for(var g=0;g<a;g++){var m=new S(g*(l+c),0,l,p);m.subLayers.image=new T(u[2*g].imgSrc),w=s(u[2*g].color),m.subLayers.color=new O(w);var b=new S(g*(l+c),0,l,p,!0);b.subLayers.image=new T(u[2*g+1].imgSrc),w=s(u[2*g+1].color),b.subLayers.color=new O(w),y.push(m),y.push(b)}if(h){var f=new S(0,0,l,p,!0);f.subLayers.image=new T(u[u.length-1].imgSrc),w=s(u[u.length-1].color),f.subLayers.color=new O(w),y.push(f),this.enableHighLight=!0,this.maxHighLightNum=a}}else{l=n,p=(o-(a-1)*c)/a;for(var g=0;g<a;g++){var m=new S(0,g*(p+c),l,p);m.subLayers.image=new T(u[2*g].imgSrc),w=s(u[2*g].color),m.subLayers.color=new O(w);var b=new S(0,g*(p+c),l,p,!0);b.subLayers.image=new T(u[2*g+1].imgSrc),w=s(u[2*g+1].color),b.subLayers.color=new O(w),y.push(m),y.push(b)}if(h){var f=new S(0,0,l,p,!0);f.subLayers.image=new T(u[u.length-1].imgSrc),w=s(u[u.length-1].color),f.subLayers.color=new O(w),y.push(f),this.enableHighLight=!0,this.maxHighLightNum=a}}this.subType="ButtonGroup",t.call(this,e,r,n,o,y)}function a(e,r,n,o,a,i,c){c=c||{};var u,h,w,l,p=[];if(0==a){u=[i[0].slices[0],i[1].slices[0]],h=new S(0,0,n,o),h.subLayers.image=new T(u[0].imgSrc),h.subLayers.color=new O(s(u[0].color));var y=c.pointerLength/Math.sqrt(2);w=new S(n/2,o/2,y,y),w.subLayers.image=new T(u[1].imgSrc),w.subLayers.color=new O(s(u[1].color)),p.push(h),p.push(w)}else if(1==a){u=[i[0].slices[0],i[1].slices[0],i[2].slices[0]],h=new S(0,0,n,o),h.subLayers.image=new T(u[0].imgSrc),h.subLayers.color=new O(s(u[0].color)),l=new S(0,0,n,o),l.subLayers.image=new T(u[2].imgSrc),l.subLayers.color=new O(s(u[2].color)),l.subLayers.roi=new H(1);var y=c.pointerLength/Math.sqrt(2);w=new S(n/2,o/2,y,y),w.subLayers.image=new T(u[1].imgSrc),w.subLayers.color=new O(s(u[1].color)),p.push(h),p.push(w),p.push(l)}else 2==a&&(u=[i[0].slices[0]],l=new S(0,0,n,o),l.subLayers.image=new T(u[0].imgSrc),l.subLayers.color=new O(s(u[0].color)),l.subLayers.roi=new H(1),p.push(l));t.call(this,e,r,n,o,p)}function i(e,r,n,o,a){var i,c=[];i=new S(0,0,n,o),i.subLayers.image=new T(a.imgSrc),i.subLayers.color=new O(s(a.color)),c.push(i),t.call(this,e,r,n,o,c)}function c(e,r,n,o,a,i,c){var u,h=[];u=new S(0,0,n,o),u.subLayers.font=new x(a,i),u.subLayers.image=new T(c.imgSrc),u.subLayers.color=new O(s(c.color)),h.push(u),t.call(this,e,r,n,o,h)}function u(e,r,s,n){var o=[];t.call(this,e,r,s,n,o)}function h(e,r,n,o,a){var i,c=[];i=new S(0,0,n,o),i.subLayers.image=new T(a.imgSrc),i.subLayers.color=new O(s(a.color)),c.push(i),t.call(this,e,r,n,o,c)}function w(e,r,s,n,o,a){var i,c,u=[];i=0!=o.symbolMode;var h=o.maxFontWidth;if(h){var w=o.decimalCount,l=o.numOfDigits,p=0;i&&(c=new S(0,0,h,n),c.subLayers.font=new x("+",a),u.push(c),p+=h);for(var y,g=0;g<l-w;g++)y=new S(p,0,h,n),y.subLayers.font=new x("0",a),u.push(y),p+=h;if(w>0){var m=new S(p,0,.5*h,n);m.subLayers.font=new x(".",a),u.push(m),p=Math.floor(p+.5*h);for(var g=0;g<w;g++)y=new S(p,0,h,n),y.subLayers.font=new x("0",a),u.push(y),p+=h}t.call(this,e,r,s,n,u)}}function l(e,r,n,o,a,i,c){var u,h,w=[];u=new S(0,0,n,o),u.subLayers.image=new T(c[0].imgSrc),u.subLayers.color=new O(s(c[0].color)),w.push(u);var l=i.w,p=i.h;l&&p&&(h="horizontal"==a?new S(0,-(p-o)/2,l,p):new S(-(l-n)/2,0,l,p),h.subLayers.image=new T(c[1].imgSrc),h.subLayers.color=new O(s(c[1].color)),w.push(h)),t.call(this,e,r,n,o,w)}function p(e,r,n,o,a,i){var c,u=new S(0,0,n,o),h=new S(0,0,n,o),w=new S(0,0,n,o),l=Number(a.progressModeId),p=Number(a.cursor),y=i.length;c=s(i[0].color),u.subLayers.color=new O(c),u.subLayers.image=new T(i[0].imgSrc),0==l?(c=s(i[1].color),h.subLayers.color=new O(c),h.subLayers.image=new T(i[1].imgSrc),h.subLayers.roi=new H(0)):1==l?(c=s(i[1].color),h.subLayers.color=new O(c)):3==l&&(c=s(i[1].color),h.subLayers.color=new O(c)),1==p&&(w.subLayers.image=new T(i[y-1].imgSrc));var g=[u,h,w];this.subType="Progress",t.call(this,e,r,n,o,g)}function y(e,r,n,o,a,i){var c=new S(0,0,n,o),u=s(i[0].color);c.subLayers.color=new O(u),c.subLayers.image=new T(i[0].imgSrc);var h=[c];this.subType="Switch",t.call(this,e,r,n,o,h)}function g(e,r,n,o,a,i){for(var c,u=[],h=0;h<i.length;h++)u[h]=new S(0,0,n,o),c=s(i[h].color),u[h].subLayers.color=new O(c),u[h].subLayers.image=new T(i[h].imgSrc);this.subType="Slide",t.call(this,e,r,n,o,u)}function m(e,r,n,o,a,i,c){var u=Number(a.dateTimeModeId),h=a.maxFontWidth,w=h,l=o,p=!a.disableHighlight,y=0,g=null,m=null,b=0,f=0,d=[],L="",v=0;switch(u){case 0:for(b=8,v=0;v<b;v++)y=v*h,g=new S(y,0,w,l),g.subLayers.font=2==v||5==v?new x(":",i):new x("0",i),d.push(g);if(p){for(f=3,w=2*h,y=0,v=0;v<f;v++)m=new S(y,0,w,l),m.subLayers.image=new T(c.imgSrc),L=s(c.color),m.subLayers.color=new O(L),d.push(m),y+=3*h;this.enableHighLight=!0,this.maxHighLightNum=f}break;case 1:for(b=5,v=0;v<b;v++)y=v*h,g=new S(y,0,w,l),g.subLayers.font=2==v?new x(":",i):new x("0",i),d.push(g);if(p){for(f=2,w=2*h,y=0,v=0;v<f;v++)m=new S(y,0,w,l),m.subLayers.image=new T(c.imgSrc),L=s(c.color),m.subLayers.color=new O(L),d.push(m),y+=3*h;this.enableHighLight=!0,this.maxHighLightNum=f}break;case 2:for(b=10,v=0;v<b;v++)y=v*h,g=new S(y,0,w,l),g.subLayers.font=4==v||7==v?new x("/",i):new x("0",i),d.push(g);if(p){for(f=3,w=4*h,y=0,v=0;v<f;v++)m=new S(y,0,w,l),m.subLayers.image=new T(c.imgSrc),L=s(c.color),m.subLayers.color=new O(L),d.push(m),0===v?(y+=5*h,w=2*h):y+=3*h;this.enableHighLight=!0,this.maxHighLightNum=f}break;case 3:for(b=10,v=0;v<b;v++)y=v*h,g=new S(y,0,w,l),g.subLayers.font=4==v||7==v?new x("-",i):new x("0",i),d.push(g);if(p){for(f=3,w=4*h,y=0,v=0;v<f;v++)m=new S(y,0,w,l),m.subLayers.image=new T(c.imgSrc),L=s(c.color),m.subLayers.color=new O(L),d.push(m),0===v?(y+=5*h,w=2*h):y+=3*h;this.enableHighLight=!0,this.maxHighLightNum=f}break;default:for(b=8,v=0;v<b;v++)y=v*h,g=new S(y,0,w,l),g.subLayers.font=2==v||5==v?new x(":",i):new x("0",i),d.push(g);if(p){for(f=3,w=2*h,y=0,v=0;v<f;v++)m=new S(y,0,w,l),m.subLayers.image=new T(c.imgSrc),L=s(c.color),m.subLayers.color=new O(L),d.push(m),y+=3*h;this.enableHighLight=!0,this.maxHighLightNum=f}}this.subType="Datetime",t.call(this,e,r,n,o,d)}function b(e,r,s,n,o,a){for(var i=[],c=o.numOfDigits,u=(o.symbolMode,o.decimalCount,o.characterH),h=o.characterW,w=[],l=0;l<a.length;l++)w.push(a[l].imgSrc);c+=2;var p;for(l=0;l<c;l++)p=new S(0,0,h,u,!0),p.subLayers.image=new T(w),i.push(p);this.subType="TexNum",t.call(this,e,r,s,n,i)}function f(e,r,n,o,a,i,c,u,h){var w=[],e=e,r=r,n=n,o=o,l=a.itemHeight,p=a.itemWidth,y=a.selectorHeight,g=a.selectorWidth,m=a.itemCount,b=a.curValue,f=a.itemShowCount,d={"font-family":a.titleFont.fontFamily,"font-color":a.titleFont.fontColor,"font-size":a.titleFont.fontSize,"font-italic":a.titleFont.fontItalic,"font-bold":a.titleFont.fontBold,"text-align":"start","text-baseline":"top"},L=a.selectorTitle;this.disableHighlight=a.disableHighlight;var i=i,u=u,c=c;if(k=o/2+y/2-(b+1)*l,F=new S(g/2-p/2,k,p,l*m,!0),F.subLayers.image=new T(c),F.subLayers.roi=new H(0,0,(b+1)*l,p,(b+1)*l,p,(b+1)*l+f*l,0,(b+1)*l+f*l),w.push(F),k=-(b-f)*l,F=new S(g/2-p/2,k,p,l*m,!0),F.subLayers.image=new T(c),F.subLayers.roi=new H(0,0,-k,p,-k,p,f*l-k,0,f*l-k),w.push(F),F=new S(0,o/2-y/2,g,y,!0),i.imgSrc)F.subLayers.image=new T(i.imgSrc);else{var v=s(i.color);F.subLayers.color=new O(v)}w.push(F);var j=o/2-y/2,k=j-b*y;if(F=new S(0,k,g,y*m,!0),F.subLayers.image=new T(u),k=b*y,F.subLayers.roi=new H(0,0,k,n,k,n,k+y,0,k+y),w.push(F),L){var F=new S(0,o/2-y/2,g,y,!0);F.subLayers.font=new x(L,d),w.push(F)}if(this.enableHighLight=!a.disableHighlight,this.enableHighLight){if(F=new S(0,o/2-y/2,g,y,!0),h.imgSrc)F.subLayers.image=new T(h.imgSrc);else{var v=s(h.color);F.subLayers.color=new O(v)}w.push(F),this.maxHighLightNum=1}this.subType="Selector",t.call(this,e,r,n,o,w)}function d(e,r,n,o,a,i){var c=[],e=e,r=r,n=n,o=o;this.disableHighlight=a.disableHighlight;var u=i[0].slices[0].imgSrc,h=i[1].slices[0].imgSrc,w=i[2].slices[0].imgSrc,l=i[3].slices[0];if(curLayer=new S(0,0,n,o,!0),curLayer.subLayers.image=new T(u),c.push(curLayer),curLayer=new S(0,0,n,o,!0),curLayer.subLayers.image=new T(h),curLayer.subLayers.roi=new H(1),c.push(curLayer),curLayer=new S(0,0,n,o,!0),curLayer.subLayers.image=new T(w),c.push(curLayer),this.enableHighLight=!0,this.enableHighLight){if(curLayer=new S(0,0,n,o,!0),l.imgSrc)curLayer.subLayers.image=new T(l.imgSrc);else{var p=s(l.color);curLayer.subLayers.color=new O(p)}c.push(curLayer),this.maxHighLightNum=1}this.subType="RotaryKnob",t.call(this,e,r,n,o,c)}function L(e,r,n,o,a){var i=[],c=new S(.8*n+10,5,.1*n-10,.8*o);c.subLayers.image=new T(a[0].imgSrc);var u=new S(.9*n+5,5,.1*n-10,.8*o);u.subLayers.image=new T(a[1].imgSrc);var h=new S(5,5,.8*n,.8*o);h.subLayers.image=new T(a[2].imgSrc),h.subLayers.color=new O(s(a[2].color));var w=new S(5,.8*o+10,n-10,.2*o-15);w.subLayers.color=new O(s("rgb(0,0,0)"));var l=new S(0,0,n,o);l.subLayers.color=new O(s("rgb(255,255,255"));var p=new S(.8*n+10,5,.1*n-10,.01*o);p.subLayers.color=new O(s("rgb(255,255,255)"));var y=new S(.9*n+5,5,.1*n-10,.01*o);y.subLayers.color=new O(s("rgb(255,255,255)"));var g=Math.min(n,o),m=new S(5,5,.02*g,.02*g);m.subLayers.image=new T(a[3].imgSrc),i.push(l),i.push(c),i.push(u),i.push(h),i.push(w),i.push(p),i.push(y),i.push(m),this.subType="ColorPicker",t.call(this,e,r,n,o,i)}function v(e,r,s,n,o,a){var i,c,u,h,w,l=[],p={};i=new S(0,0,s,n),i.subLayers.image=new T(a[0].imgSrc),l.push(i),c=new S(o.yearX,o.yearY,o.yearW,o.yearH),p["font-size"]=o.titleFontSize,p["font-family"]=o.titleFontFamily,p["font-color"]=o.titleFontColor,c.subLayers.font=new x("2018",p),l.push(c),u=new S(o.monthX,o.monthY,o.monthW,o.monthH),u.subLayers.font=new x("1",p),l.push(u);for(var y=o.paddingX,g=o.paddingY,m=0;m<5;m++){for(var b=0;b<7;b++)h=new S(y,g,o.dayW,o.dayH),p={},p["font-size"]=o.itemFontSize,p["font-family"]=o.itemFontFamily,p["font-color"]=o.itemFontColor,h.subLayers.image=new T(a[3].imgSrc),h.subLayers.font=new x(String(b+1),p),l.push(h),y+=o.dayW;y=o.paddingX,g+=o.dayH}w=new S(0,0,o.dayW,o.dayH),w.subLayers.image=new T(a[a.length-1].imgSrc),l.push(w),t.call(this,e,r,s,n,l)}var S=e.Layer,H=e.ROISubLayer,x=e.FontSubLayer,T=e.TextureSubLayer,O=e.ColorSubLayer;t.prototype.toObject=function(){return{info:{left:this.info.left,top:this.info.top,width:this.info.width,height:this.info.height},enableHighLight:this.enableHighLight||!1,highLightNum:0,maxHighLightNum:this.maxHighLightNum||0,mode:this.mode,tag:this.tag,layers:this.layers,otherAttrs:this.otherAttrs}},t.prototype.commands={},t.execute=function(e,t,r){return"__tag"==t?this.getTag(e.tag):"string"==typeof t?'"'+t+'"':t};var j="Int",k="ID",F="EXP";n.prototype=Object.create(t.prototype),n.prototype.constructor=n,n.prototype.commands={},n.prototype.commands.onInitialize=[["temp","a",new r(F,"this.mode")],["setTag",new r(j,1)],["set",new r(k,"a"),new r(j,3)],["if"],["gte",new r(k,"a"),new r(j,100)],["set",new r(F,"this.layers.1.hidden"),new r(j,1)],["else"],["set",new r(F,"this.layers.1.hidden"),new r(j,0)],["end"]],n.prototype.commands.onMouseDown=[["temp","b",new r(F,"this.mode")],["print",new r(k,"b")],["if"],["eq",new r(k,"b"),new r(j,0)],["set",new r(F,"this.layers.0.hidden"),new r(j,1)],["set",new r(F,"this.layers.1.hidden"),new r(j,0)],["setTag",new r(j,0)],["else"],["temp","c",new r(j,0)],["getTag","c"],["if"],["gt",new r(k,"c"),new r(j,0)],["setTag",new r(j,0)],["else"],["setTag",new r(j,1)],["end"],["end"]],n.prototype.commands.onMouseUp=[["temp","b",new r(F,"this.mode")],["if"],["eq",new r(k,"b"),new r(j,0)],["set",new r(F,"this.layers.0.hidden"),new r(j,0)],["set",new r(F,"this.layers.1.hidden"),new r(j,1)],["setTag",new r(j,12)],["end"]],n.prototype.commands.onTagChange=[["temp","a",new r(j,0)],["temp","b",new r(F,"this.mode")],["getTag","a"],["if"],["eq",new r(k,"b"),new r(j,1)],["if"],["gt",new r(k,"a"),new r(j,0)],["set",new r(F,"this.layers.0.hidden"),new r(j,1)],["set",new r(F,"this.layers.1.hidden"),new r(j,0)],["else"],["set",new r(F,"this.layers.0.hidden"),new r(j,0)],["set",new r(F,"this.layers.1.hidden"),new r(j,1)],["end"],["end"]],o.prototype=Object.create(t.prototype),o.prototype.constructor=o,o.prototype.commands.onInitialize=[],o.prototype.commands.onMouseDown=[["temp","a",new r(j,0)],["temp","b",new r(j,0)],["temp","c",new r(j,0)],["set",new r(k,"c"),new r(F,"this.layers.length")],["minus","c",new r(j,2)],["set",new r(k,"a"),new r(F,"this.innerX")],["set",new r(k,"b"),new r(F,"this.innerY")],["temp","lx",new r(j,0)],["temp","ly",new r(j,0)],["temp","lw",new r(j,0)],["temp","lh",new r(j,0)],["temp","rx",new r(j,0)],["temp","ry",new r(j,0)],["while"],["gte",new r(k,"c"),new r(j,0)],["set",new r(k,"lx"),new r(F,"this.layers.c.x")],["set",new r(k,"ly"),new r(F,"this.layers.c.y")],["set",new r(k,"lw"),new r(F,"this.layers.c.width")],["set",new r(k,"lh"),new r(F,"this.layers.c.height")],["set",new r(k,"rx"),new r(k,"lx")],["set",new r(k,"ry"),new r(k,"ly")],["add","rx",new r(k,"lw")],["add","ry",new r(k,"lh")],["if"],["gte",new r(k,"a"),new r(k,"lx")],["if"],["gt",new r(k,"rx"),new r(k,"a")],["if"],["gte",new r(k,"b"),new r(k,"ly")],["if"],["gt",new r(k,"ry"),new r(k,"b")],["print",new r(k,"c"),"hit"],["divide","c",new r(j,2)],["setTag",new r(k,"c")],["set",new r(k,"c"),new r(j,0)],["end"],["end"],["end"],["end"],["minus","c",new r(j,2)],["end"]],o.prototype.commands.onMouseUp=[],o.prototype.commands.onTagChange=[["temp","a",new r(j,0)],["temp","b",new r(j,0)],["temp","c",new r(j,0)],["set",new r(k,"a"),new r(F,"this.layers.length")],["set",new r(k,"c"),new r(k,"a")],["divide","c",new r(j,2)],["while"],["gt",new r(k,"a"),new r(j,0)],["minus","a",new r(j,1)],["print",new r(k,"a")],["set",new r(F,"this.layers.a.hidden"),new r(j,1)],["minus","a",new r(j,1)],["set",new r(F,"this.layers.a.hidden"),new r(j,0)],["end"],["getTag","a"],["print",new r(k,"a")],["if"],["gte",new r(k,"a"),new r(j,0)],["if"],["gt",new r(k,"c"),new r(k,"a")],["multiply","a",new r(j,2)],["set",new r(F,"this.layers.a.hidden"),new r(j,1)],["add","a",new r(j,1)],["set",new r(F,"this.layers.a.hidden"),new r(j,0)],["end"],["end"]],a.prototype=Object.create(t.prototype),a.prototype.constructor=a,i.prototype=Object.create(t.prototype),i.prototype.constructor=i,c.prototype=Object.create(t.prototype),c.prototype.constructor=c,u.prototype=Object.create(t.prototype),u.prototype.constructor=u,h.prototype=Object.create(t.prototype),h.prototype.constructor=h,w.prototype=Object.create(t.prototype),w.prototype.constructor=w,l.prototype=Object.create(t.prototype),l.prototype.constructor=l,p.prototype=Object.create(t.prototype),p.prototype.constructor=p,y.prototype=Object.create(t.prototype),y.prototype.constructor=y,g.prototype=Object.create(t.prototype),g.prototype.constructor=g,m.prototype=Object.create(t.prototype),m.prototype.constructor=m,b.prototype=Object.create(t.prototype),b.prototype.constructor=b,f.prototype=Object.create(t.prototype),f.prototype.constructor=f,d.prototype=Object.create(t.prototype),d.prototype.constructor=d,L.prototype=Object.create(t.prototype),L.prototype.constructor=L,v.prototype=Object.create(t.prototype),v.prototype.constructor=v;var N={},W={};N.transCommand=function(e,r){var s,n,o,a=r[0];switch(a){case"temp":n=r[1],o=t.execute(e,r[2]),W[n]=o,s="var "+n+"="+o+";\n";break;case"set":n=r[1],o=t.execute(e,r[2]),n in W&&(W[n]=o),s=n+"="+o+";\n";break;case"if":s="if";break;case"pred":var i=r[2],c=r[3];i in W||(i=t.execute(e,i)),c in W||(c=t.execute(e,c)),s="("+i+r[1]+c+"){\n";break;case"else":s="}else{\n";break;case"end":s="}\n";break;case"setTag":s='WidgetExecutor.setTag("'+e.tag+'",'+r[1]+")"}return s},N.transFunction=function(e,t){W={};for(var r="",s=0;s<t.length;s++)r+=this.transCommand(e,t[s]);return r},N.complier={},function(e){"use strict";function t(e){for(var r=[],s=!0;e.length&&s;){var n,o=e[0];switch(o[0]){case"if":n={},n.type="IF",n.args=[],e.shift(),n.args.push(e.shift()),n.args.push(t(e)),"else"===e[0][0]&&(e.shift(),n.args.push(t(e))),e.shift(),r.push(n);break;case"while":n={type:"WHILE",args:[]},e.shift(),n.args.push(e.shift()),n.args.push(t(e)),e.shift(),r.push(n);break;case"else":case"end":s=!1;break;default:r.push({type:"EXP",args:[o]}),e.shift()}}return r}function r(e,t){this.label=String(e),this.cmd=t}function s(e,t){h=0;var r=o(e,t);return n(r),r}function n(e){for(var t,r={},s=0;s<e.length;s++)t=e[s],""!==t.label&&(r[t.label]=s);for(s=0;s<e.length;s++){t=e[s];var n=t.cmd;if("jump"===n[0]){var o=r[n[2]];n[2]=o-s}}}function o(e,t){for(var s=[],n=0;n<e.length;n++){var o=e[n];switch(o.type){case"EXP":s.push(new r("",o.args[0]));break;case"IF":[].push.apply(s,a(o,t));break;case"WHILE":[].push.apply(s,i(o,t));break;default:s.push(new r("",o.args[0]))}}return s}function a(e,t){var s=[],n=e.args;2===n.length&&n.push([]);var a=n[0],i=n[2],c=n[1];if(t=t||!1){var u=a[0],g=w[u];g&&(a[0]=g,i=n[1],c=n[2])}s.push(new r("",a));var m=h;h+=1,s.push(new r("",[l,y,m])),[].push.apply(s,o(c,t));var b=h;h+=1,s.push(new r("",[l,y,b]));var f=o(i,t);return f.length>0?f[0].label=String(m):f.push(new r(m,[p,"",""])),[].push.apply(s,f),s.push(new r(b,[p,"",""])),s}function i(e,t){var s=[],n=e.args,a=n[0],i=n[1],c=h++,u=h++,g=h++;if(t){var m=w[a[0]];m?(a[0]=m,s.push(new r(c,a)),s.push(new r("",[l,y,u])),s.push(new r("",[l,y,g]))):(s.push(new r(c,a)),s.push(new r("",[l,y,g])),s.push(new r("",[l,y,u])))}var b=o(i,t);return b.push(new r("",[l,y,c])),b[0].label=String(u),[].push.apply(s,b),s.push(new r(g,[p,"",""])),s}var c={};c.parse=t;var u={},h=0,w={gte:"lt",lte:"gt"};u.trans=s;var l="jump",p="end",y="";e.parser=c,e.transformer=u}(N.complier);var C={};return C.models={},C.models.Button=n,C.models.ButtonGroup=o,C.models.Dashboard=a,C.models.RotateImg=i,C.models.TextArea=c,C.models.Progress=p,C.models.Switch=y,C.models.ScriptTrigger=u,C.models.Video=h,C.models.Slide=g,C.models.Num=w,C.models.SlideBlock=l,C.models.DateTime=m,C.models.TexNum=b,C.models.Selector=f,C.models.RotaryKnob=d,C.models.ColorPicker=L,C.models.DatePicker=v,C.Widget=t,C.WidgetCommandParser=N,C});