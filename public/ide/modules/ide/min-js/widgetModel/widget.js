!function(e){if("function"==typeof define&&define.amd)define("WidgetModel",["./layer"],e);else if("object"==typeof module&&module.exports){console.log(__dirpath);var t=require("./layer");module.exports=e(t)}else window.WidgetModel=e(window.LayerModel)}(function(e){function t(e,t,r,s,n){this.info={left:e,top:t,width:r,height:s},this.tag="defaultTag",this.type="general",this.mode=0,this.arrange=0,this.otherAttrs=[],n&&n.length?this.layers=n:this.layers=[new N(r,s)]}function r(e,t){this.type=e,this.value=t}function s(e){var t=[],r={r:0,g:0,b:0,a:0};if(-1!==e.indexOf("rgba"))t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),r={r:t[0],g:t[1],b:t[2],a:255*t[3]};else{if(-1===e.indexOf("rgb"))throw new Error("parsing color error: "+e);t=e.split(/[\(|\)]/)[1].split(",").map(function(e){return Number(e)}),r={r:t[0],g:t[1],b:t[2],a:255}}return r}function n(e,r,n,o,a,i,c,h){var u,l=new N(0,0,n,o);l.subLayers.font=new O(a,i),l.subLayers.image=new j([c[0].imgSrc]),u=s(c[0].color),l.subLayers.color=new F(u);var w=new N(0,0,n,o);w.subLayers.font=new O(a,i),w.subLayers.image=new j([c[1].imgSrc]),u=s(c[1].color),w.subLayers.color=new F(u);var p,g=[w,l];h&&(p=new N(0,0,n,o),p.subLayers.image=new j([c[2].imgSrc]),u=s(c[2].color),p.subLayers.color=new F(u),p.hidden=!0,g.push(p),this.enableHighLight=!0,this.maxHighLightNum=1),this.subType="Button",t.call(this,e,r,n,o,g)}function o(e,r,n,o,a,i,c,h,u){var l,w=0,p=0,g=[];if(0==i){w=Math.floor((n-(a-1)*c)/a),p=o;for(var y=0;y<a;y++){var m=new N(y*(w+c),0,w,p);m.subLayers.image=new j(h[2*y].imgSrc),l=s(h[2*y].color),m.subLayers.color=new F(l);var b=new N(y*(w+c),0,w,p,!0);b.subLayers.image=new j(h[2*y+1].imgSrc),l=s(h[2*y+1].color),b.subLayers.color=new F(l),g.push(m),g.push(b)}if(u){var f=new N(0,0,w,p,!0);f.subLayers.image=new j(h[h.length-1].imgSrc),l=s(h[h.length-1].color),f.subLayers.color=new F(l),g.push(f),this.enableHighLight=!0,this.maxHighLightNum=a}}else{w=n,p=Math.floor((o-(a-1)*c)/a);for(var y=0;y<a;y++){var m=new N(0,y*(p+c),w,p);m.subLayers.image=new j(h[2*y].imgSrc),l=s(h[2*y].color),m.subLayers.color=new F(l);var b=new N(0,y*(p+c),w,p,!0);b.subLayers.image=new j(h[2*y+1].imgSrc),l=s(h[2*y+1].color),b.subLayers.color=new F(l),g.push(m),g.push(b)}if(u){var f=new N(0,0,w,p,!0);f.subLayers.image=new j(h[h.length-1].imgSrc),l=s(h[h.length-1].color),f.subLayers.color=new F(l),g.push(f),this.enableHighLight=!0,this.maxHighLightNum=a}}this.subType="ButtonGroup",t.call(this,e,r,n,o,g)}function a(e,r,n,o,a,i,c){c=c||{};var h,u,l,w,p=[];if(0==a){h=[i[0].slices[0],i[1].slices[0]],u=new N(0,0,n,o),u.subLayers.image=new j(h[0].imgSrc),u.subLayers.color=new F(s(h[0].color));var g=c.pointerLength/Math.sqrt(2);l=new N(n/2,o/2,g,g),l.subLayers.image=new j(h[1].imgSrc),l.subLayers.color=new F(s(h[1].color)),p.push(u),p.push(l)}else if(1==a){h=[i[0].slices[0],i[1].slices[0],i[2].slices[0]],u=new N(0,0,n,o),u.subLayers.image=new j(h[0].imgSrc),u.subLayers.color=new F(s(h[0].color)),w=new N(0,0,n,o),w.subLayers.image=new j(h[2].imgSrc),w.subLayers.color=new F(s(h[2].color)),w.subLayers.roi=new k(1);var g=c.pointerLength/Math.sqrt(2);l=new N(n/2,o/2,g,g),l.subLayers.image=new j(h[1].imgSrc),l.subLayers.color=new F(s(h[1].color)),p.push(u),p.push(l),p.push(w)}else 2==a&&(h=[i[0].slices[0]],w=new N(0,0,n,o),w.subLayers.image=new j(h[0].imgSrc),w.subLayers.color=new F(s(h[0].color)),w.subLayers.roi=new k(1),p.push(w));t.call(this,e,r,n,o,p)}function i(e,r,n,o,a){var i,c=[];i=new N(0,0,n,o),i.subLayers.image=new j(a.imgSrc),i.subLayers.color=new F(s(a.color)),c.push(i),t.call(this,e,r,n,o,c)}function c(e,r,n,o,a,i,c){var h,u=[];h=new N(0,0,n,o),h.subLayers.font=new O(a,i),h.subLayers.image=new j(c.imgSrc),h.subLayers.color=new F(s(c.color)),u.push(h),t.call(this,e,r,n,o,u)}function h(e,r,s,n){var o=[];t.call(this,e,r,s,n,o)}function u(e,r,n,o,a){var i,c=[];i=new N(0,0,n,o),i.subLayers.image=new j(a.imgSrc),i.subLayers.color=new F(s(a.color)),c.push(i),t.call(this,e,r,n,o,c)}function l(e,r,s,n,o,a){console.log(o);var i=o.decimalCount,c=o.numOfDigits,h=o.maxFontWidth,u=Number(o.spacing),l=Number(o.paddingRatio)||0,w=h*i>s?h/2:(s-h*i)/2;0!==l&&(w=l*h);var p,g,y=[];p=0!=o.symbolMode;var m=o.maxFontWidth;if(m){var b=w;p&&(g=new N(b,0,m,n),g.subLayers.font=new O("+",a),y.push(g),b+=m+u);for(var f,d=0;d<c-i;d++)f=new N(b,0,m,n),console.log(b,m),f.subLayers.font=new O("0",a),y.push(f),b=b+m+u;if(i>0){var L=new N(b,0,.5*m,n);L.subLayers.font=new O(".",a),y.push(L),b=Math.floor(b+.5*m+u);for(var d=0;d<i;d++)f=new N(b,0,m,n),f.subLayers.font=new O("0",a),y.push(f),b+=m+u}o.enableAnimation&&(y=y.concat(_.cloneDeep(y))),t.call(this,e,r,s,n,y)}}function w(e,r,n,o,a,i,c){var h,u,l=[];h=new N(0,0,n,o),h.subLayers.image=new j(c[0].imgSrc),h.subLayers.color=new F(s(c[0].color)),l.push(h);var w=i.w,p=i.h;w&&p&&(u="horizontal"==a?new N(0,-(p-o)/2,w,p):new N(-(w-n)/2,0,w,p),u.subLayers.image=new j(c[1].imgSrc),u.subLayers.color=new F(s(c[1].color)),l.push(u)),t.call(this,e,r,n,o,l)}function p(e,r,n,o,a,i){var c,h=new N(0,0,n,o),u=new N(0,0,n,o),l=new N(0,0,n,o),w=Number(a.progressModeId),p=Number(a.cursor),g=i.length;c=s(i[0].color),h.subLayers.color=new F(c),h.subLayers.image=new j(i[0].imgSrc),0==w?(c=s(i[1].color),u.subLayers.color=new F(c),u.subLayers.image=new j(i[1].imgSrc),u.subLayers.roi=new k(0)):1==w?(c=s(i[1].color),u.subLayers.color=new F(c)):3==w&&(c=s(i[1].color),u.subLayers.color=new F(c)),1==p&&(l.subLayers.image=new j(i[g-1].imgSrc));var y=[h,u,l];this.subType="Progress",t.call(this,e,r,n,o,y)}function g(e,r,n,o,a,i){var c=new N(0,0,n,o),h=s(i[0].color);c.subLayers.color=new F(h),c.subLayers.image=new j(i[0].imgSrc);var u=[c];this.subType="Switch",t.call(this,e,r,n,o,u)}function y(e,r,n,o,a,i){for(var c,h=[],u=0;u<i.length;u++)h[u]=new N(0,0,n,o),c=s(i[u].color),h[u].subLayers.color=new F(c),h[u].subLayers.image=new j(i[u].imgSrc);this.subType="Slide",t.call(this,e,r,n,o,h)}function m(e,r,n,o,a,i){for(var c,h=[],u=0;u<i.length;u++)h[u]=new N(0,0,n,o),c=s(i[u].color),h[u].subLayers.color=new F(c),h[u].subLayers.image=new j(i[u].imgSrc);this.subType="Slide",t.call(this,e,r,n,o,h)}function b(e,r,n,o,a,i,c){var h=Number(a.dateTimeModeId),u=a.maxFontWidth,l=u,w=o,p=!a.disableHighlight,g=0,y=null,m=null,b=0,f=0,d=[],L="",v=0,S=0;switch(h){case 0:S=8;break;case 1:S=5;break;case 2:case 3:S=10}var H=Number(a.spacing),x=Number(a.paddingRatio)||0,T=u*S>n?u/2:(n-u*S)/2;switch(0!==x&&(T=x*u),h){case 0:for(b=8,v=0;v<b;v++)g=T+v*(u+H),y=new N(g,0,l,w),y.subLayers.font=2==v||5==v?new O(":",i):new O("0",i),d.push(y);if(p){for(f=3,l=2*u+H,g=T,v=0;v<f;v++)m=new N(g,0,l,w),m.subLayers.image=new j(c.imgSrc),L=s(c.color),m.subLayers.color=new F(L),d.push(m),g+=3*(u+H);this.enableHighLight=!0,this.maxHighLightNum=f}break;case 1:for(b=5,v=0;v<b;v++)g=T+v*(u+H),y=new N(g,0,l,w),y.subLayers.font=2==v?new O(":",i):new O("0",i),d.push(y);if(p){for(f=2,l=2*u+H,g=T,v=0;v<f;v++)m=new N(g,0,l,w),m.subLayers.image=new j(c.imgSrc),L=s(c.color),m.subLayers.color=new F(L),d.push(m),g+=3*(u+H);this.enableHighLight=!0,this.maxHighLightNum=f}break;case 2:for(b=10,v=0;v<b;v++)g=T+v*(u+H),y=new N(g,0,l,w),y.subLayers.font=4==v||7==v?new O("/",i):new O("0",i),d.push(y);if(p){for(f=3,l=4*u+3*H,g=T,v=0;v<f;v++)m=new N(g,0,l,w),m.subLayers.image=new j(c.imgSrc),L=s(c.color),m.subLayers.color=new F(L),d.push(m),0===v?(g+=5*(u+H),l=2*u+H):g+=3*(u+H);this.enableHighLight=!0,this.maxHighLightNum=f}break;case 3:for(b=10,v=0;v<b;v++)g=T+v*(u+H),y=new N(g,0,l,w),y.subLayers.font=4==v||7==v?new O("-",i):new O("0",i),d.push(y);if(p){for(f=3,l=4*u+3*H,g=T,v=0;v<f;v++)m=new N(g,0,l,w),m.subLayers.image=new j(c.imgSrc),L=s(c.color),m.subLayers.color=new F(L),d.push(m),0===v?(g+=5*(u+H),l=2*u):g+=3*(u+H);this.enableHighLight=!0,this.maxHighLightNum=f}break;default:for(b=8,v=0;v<b;v++)g=T+v*(u+H),y=new N(g,0,l,w),y.subLayers.font=2==v||5==v?new O(":",i):new O("0",i),d.push(y);if(p){for(f=3,l=2*u+H,g=T,v=0;v<f;v++)m=new N(g,0,l,w),m.subLayers.image=new j(c.imgSrc),L=s(c.color),m.subLayers.color=new F(L),d.push(m),g+=3*(u+H);this.enableHighLight=!0,this.maxHighLightNum=f}}this.subType="Datetime",t.call(this,e,r,n,o,d)}function f(e,r,s,n,o,a){for(var i=[],c=o.numOfDigits,h=(o.symbolMode,o.decimalCount,o.characterH),u=o.characterW,l=[],w=0;w<a.length;w++)l.push(a[w].imgSrc);c+=2;var p;for(w=0;w<c;w++)p=new N(0,0,u,h,!0),p.subLayers.image=new j(l),i.push(p);this.subType="TexNum",t.call(this,e,r,s,n,i)}function d(e,r,n,o,a,i,c,h,u){var l=[],e=e,r=r,n=n,o=o,w=a.itemHeight,p=a.itemWidth,g=a.selectorHeight,y=a.selectorWidth,m=a.itemCount,b=a.curValue,f=a.itemShowCount,d={"font-family":a.titleFont.fontFamily,"font-color":a.titleFont.fontColor,"font-size":a.titleFont.fontSize,"font-italic":a.titleFont.fontItalic,"font-bold":a.titleFont.fontBold,"text-align":"start","text-baseline":"top"},L=a.selectorTitle;this.disableHighlight=a.disableHighlight;var i=i,h=h,c=c;if(H=o/2+g/2-(b+1)*w,x=new N(y/2-p/2,H,p,w*m,!0),x.subLayers.image=new j(c),x.subLayers.roi=new k(0,0,(b+1)*w,p,(b+1)*w,p,(b+1)*w+f*w,0,(b+1)*w+f*w),l.push(x),H=-(b-f)*w,x=new N(y/2-p/2,H,p,w*m,!0),x.subLayers.image=new j(c),x.subLayers.roi=new k(0,0,-H,p,-H,p,f*w-H,0,f*w-H),l.push(x),x=new N(0,o/2-g/2,y,g,!0),i.imgSrc)x.subLayers.image=new j(i.imgSrc);else{var v=s(i.color);x.subLayers.color=new F(v)}l.push(x);var S=o/2-g/2,H=S-b*g;if(x=new N(0,H,y,g*m,!0),x.subLayers.image=new j(h),H=b*g,x.subLayers.roi=new k(0,0,H,n,H,n,H+g,0,H+g),l.push(x),L){var x=new N(0,o/2-g/2,y,g,!0);x.subLayers.font=new O(L,d),l.push(x)}if(this.enableHighLight=!a.disableHighlight,this.enableHighLight){if(x=new N(0,o/2-g/2,y,g,!0),u.imgSrc)x.subLayers.image=new j(u.imgSrc);else{var v=s(u.color);x.subLayers.color=new F(v)}l.push(x),this.maxHighLightNum=1}this.subType="Selector",t.call(this,e,r,n,o,l)}function L(e,r,n,o,a,i){var c=[],e=e,r=r,n=n,o=o;this.disableHighlight=a.disableHighlight;var h=i[0].slices[0].imgSrc,u=i[1].slices[0].imgSrc,l=i[2].slices[0].imgSrc,w=i[3].slices[0];if(curLayer=new N(0,0,n,o,!0),curLayer.subLayers.image=new j(h),c.push(curLayer),curLayer=new N(0,0,n,o,!0),curLayer.subLayers.image=new j(u),curLayer.subLayers.roi=new k(1),c.push(curLayer),curLayer=new N(0,0,n,o,!0),curLayer.subLayers.image=new j(l),c.push(curLayer),this.enableHighLight=!0,this.enableHighLight){if(curLayer=new N(0,0,n,o,!0),w.imgSrc)curLayer.subLayers.image=new j(w.imgSrc);else{var p=s(w.color);curLayer.subLayers.color=new F(p)}c.push(curLayer),this.maxHighLightNum=1}this.subType="RotaryKnob",t.call(this,e,r,n,o,c)}function v(e,r,n,o,a){var i=[],c=new N(.8*n+10,5,.1*n-10,.8*o);c.subLayers.image=new j(a[0].imgSrc);var h=new N(.9*n+5,5,.1*n-10,.8*o);h.subLayers.image=new j(a[1].imgSrc);var u=new N(5,5,.8*n,.8*o);u.subLayers.image=new j(a[2].imgSrc),u.subLayers.color=new F(s(a[2].color));var l=new N(5,.8*o+10,n-10,.2*o-15);l.subLayers.color=new F(s("rgb(0,0,0)"));var w=new N(0,0,n,o);w.subLayers.color=new F(s("rgb(255,255,255"));var p=new N(.8*n+10,5,.1*n-10,.01*o);p.subLayers.color=new F(s("rgb(255,255,255)"));var g=new N(.9*n+5,5,.1*n-10,.01*o);g.subLayers.color=new F(s("rgb(0,0,0)"));var y=Math.min(n,o),m=new N(5,5,.02*y,.02*y);m.subLayers.image=new j(a[3].imgSrc),i.push(w),i.push(c),i.push(h),i.push(u),i.push(l),i.push(p),i.push(g),i.push(m),this.subType="ColorPicker",t.call(this,e,r,n,o,i)}function S(e,r,s,n,o,a){var i,c,h,u,l,w=[],p={};i=new N(0,0,s,n),i.subLayers.image=new j(a[0].imgSrc),w.push(i),c=new N(o.yearX,o.yearY,o.yearW,o.yearH),p["font-size"]=o.titleFontSize,p["font-family"]=o.titleFontFamily,p["font-color"]=o.titleFontColor,c.subLayers.font=new O("2018",p),w.push(c),h=new N(o.monthX,o.monthY,o.monthW,o.monthH),h.subLayers.font=new O("1",p),w.push(h);for(var g=o.paddingX,y=o.paddingY,m=0;m<5;m++){for(var b=0;b<7;b++)u=new N(g,y,o.dayW,o.dayH),p={},p["font-size"]=o.itemFontSize,p["font-family"]=o.itemFontFamily,p["font-color"]=o.itemFontColor,u.subLayers.image=new j(a[3].imgSrc),u.subLayers.font=new O(String(b+1),p),w.push(u),g+=o.dayW;g=o.paddingX,y+=o.dayH}l=new N(0,0,o.dayW,o.dayH),l.subLayers.image=new j(a[a.length-1].imgSrc),w.push(l),t.call(this,e,r,s,n,w)}function H(e,r,s,n,o,a){var i,c,h,u,l,w,p=[],g={},y=0;g["font-size"]=o.titleFontSize,g["font-family"]=o.titleFontFamily,g["font-color"]=o.titleFontColor,i=a[0].slices,c=new N(0,0,s,n),c.subLayers.image=new j(i[0].imgSrc),p.push(c),i=a[1].slices;var m=o.year,b=m.pos;for(y=0;y<b.length;y++)h=new N(b[y].x,b[y].y,m.w,m.h),h.subLayers.font=new O("0",g),p.push(h);i=a[2].slices;var f=o.month,d=f.pos;for(y=0;y<d.length;y++)u=new N(d[y].x,d[y].y,f.w,f.h),u.subLayers.font=new O("0",g),p.push(u);i=a[3].slices;var L=o.paddingX,v=o.paddingY;for(y=0;y<i.length;y++)l=new N(L,v,o.dayW,o.dayH),l.subLayers.image=new j(i[y].imgSrc),p.push(l);i=a[4].slices,w=new N(0,0,o.dayW,o.dayH),w.subLayers.image=new j(i[0].imgSrc),p.push(w),t.call(this,e,r,s,n,p)}function x(e,r,n,o,a,i,c){for(var h=[],u=a.characterH,l=a.characterW,w=Number(a.dateTimeModeId),p=[],g=0;g<=9;g++)p.push(i[g].imgSrc);var y=0,m=0,b=0,f=0,d=0,L=[];switch(w){case 0:y=6,m=2,b=2,f=10,this.maxHighLightNum=3;case 1:y=4,m=1,b=2,f=10,this.maxHighLightNum=2;break;case 2:y=8,m=2,b=4,f=11,this.maxHighLightNum=3;break;case 3:y=8,m=2,b=4,f=12,this.maxHighLightNum=3;break;default:console.log("error")}for(g=0;g<y;g++)g!=b&&g!=b+2||(d+=l),L=new N(d,0,l,u,!0),L.subLayers.image=new j(p),h.push(L),d+=l;for(g=0;g<m;g++)L=new N((b+3*g)*l,0,l,u,!0),L.subLayers.image=new j(i[f].imgSrc),h.push(L);if(this.enableHighLight=!a.disableHighlight,this.enableHighLight){if(L=new N(0,0,l,u,!0),c.imgSrc)L.subLayers.image=new j(c.imgSrc);else{var v=s(c.color);L.subLayers.color=new F(v)}h.push(L)}else this.maxHighLightNum=0;this.subType="TexTime",t.call(this,e,r,n,o,h)}function T(e,r,n,o){var a=[],i=new N(0,0,n,o,!0),c=s("rgba(111,111,111,1)");i.subLayers.color=new F(c),a.push(i),this.subType="ColorBlock",t.call(this,e,r,n,o,a)}var N=e.Layer,k=e.ROISubLayer,O=e.FontSubLayer,j=e.TextureSubLayer,F=e.ColorSubLayer;t.prototype.toObject=function(){return{info:{left:this.info.left,top:this.info.top,width:this.info.width,height:this.info.height},enableHighLight:this.enableHighLight||!1,highLightNum:0,maxHighLightNum:this.maxHighLightNum||0,mode:this.mode,arrange:this.arrange,tag:this.tag,layers:this.layers,otherAttrs:this.otherAttrs}},t.prototype.commands={},t.execute=function(e,t,r){return"__tag"==t?this.getTag(e.tag):"string"==typeof t?'"'+t+'"':t};var W="Int",C="ID",M="EXP";n.prototype=Object.create(t.prototype),n.prototype.constructor=n,n.prototype.commands={},n.prototype.commands.onInitialize=[["temp","a",new r(M,"this.mode")],["setTag",new r(W,1)],["set",new r(C,"a"),new r(W,3)],["if"],["gte",new r(C,"a"),new r(W,100)],["set",new r(M,"this.layers.1.hidden"),new r(W,1)],["else"],["set",new r(M,"this.layers.1.hidden"),new r(W,0)],["end"]],n.prototype.commands.onMouseDown=[["temp","b",new r(M,"this.mode")],["print",new r(C,"b")],["if"],["eq",new r(C,"b"),new r(W,0)],["set",new r(M,"this.layers.0.hidden"),new r(W,1)],["set",new r(M,"this.layers.1.hidden"),new r(W,0)],["setTag",new r(W,0)],["else"],["temp","c",new r(W,0)],["getTag","c"],["if"],["gt",new r(C,"c"),new r(W,0)],["setTag",new r(W,0)],["else"],["setTag",new r(W,1)],["end"],["end"]],n.prototype.commands.onMouseUp=[["temp","b",new r(M,"this.mode")],["if"],["eq",new r(C,"b"),new r(W,0)],["set",new r(M,"this.layers.0.hidden"),new r(W,0)],["set",new r(M,"this.layers.1.hidden"),new r(W,1)],["setTag",new r(W,12)],["end"]],n.prototype.commands.onTagChange=[["temp","a",new r(W,0)],["temp","b",new r(M,"this.mode")],["getTag","a"],["if"],["eq",new r(C,"b"),new r(W,1)],["if"],["gt",new r(C,"a"),new r(W,0)],["set",new r(M,"this.layers.0.hidden"),new r(W,1)],["set",new r(M,"this.layers.1.hidden"),new r(W,0)],["else"],["set",new r(M,"this.layers.0.hidden"),new r(W,0)],["set",new r(M,"this.layers.1.hidden"),new r(W,1)],["end"],["end"]],o.prototype=Object.create(t.prototype),o.prototype.constructor=o,o.prototype.commands.onInitialize=[],o.prototype.commands.onMouseDown=[["temp","a",new r(W,0)],["temp","b",new r(W,0)],["temp","c",new r(W,0)],["set",new r(C,"c"),new r(M,"this.layers.length")],["minus","c",new r(W,2)],["set",new r(C,"a"),new r(M,"this.innerX")],["set",new r(C,"b"),new r(M,"this.innerY")],["temp","lx",new r(W,0)],["temp","ly",new r(W,0)],["temp","lw",new r(W,0)],["temp","lh",new r(W,0)],["temp","rx",new r(W,0)],["temp","ry",new r(W,0)],["while"],["gte",new r(C,"c"),new r(W,0)],["set",new r(C,"lx"),new r(M,"this.layers.c.x")],["set",new r(C,"ly"),new r(M,"this.layers.c.y")],["set",new r(C,"lw"),new r(M,"this.layers.c.width")],["set",new r(C,"lh"),new r(M,"this.layers.c.height")],["set",new r(C,"rx"),new r(C,"lx")],["set",new r(C,"ry"),new r(C,"ly")],["add","rx",new r(C,"lw")],["add","ry",new r(C,"lh")],["if"],["gte",new r(C,"a"),new r(C,"lx")],["if"],["gt",new r(C,"rx"),new r(C,"a")],["if"],["gte",new r(C,"b"),new r(C,"ly")],["if"],["gt",new r(C,"ry"),new r(C,"b")],["print",new r(C,"c"),"hit"],["divide","c",new r(W,2)],["setTag",new r(C,"c")],["set",new r(C,"c"),new r(W,0)],["end"],["end"],["end"],["end"],["minus","c",new r(W,2)],["end"]],o.prototype.commands.onMouseUp=[],o.prototype.commands.onTagChange=[["temp","a",new r(W,0)],["temp","b",new r(W,0)],["temp","c",new r(W,0)],["set",new r(C,"a"),new r(M,"this.layers.length")],["set",new r(C,"c"),new r(C,"a")],["divide","c",new r(W,2)],["while"],["gt",new r(C,"a"),new r(W,0)],["minus","a",new r(W,1)],["print",new r(C,"a")],["set",new r(M,"this.layers.a.hidden"),new r(W,1)],["minus","a",new r(W,1)],["set",new r(M,"this.layers.a.hidden"),new r(W,0)],["end"],["getTag","a"],["print",new r(C,"a")],["if"],["gte",new r(C,"a"),new r(W,0)],["if"],["gt",new r(C,"c"),new r(C,"a")],["multiply","a",new r(W,2)],["set",new r(M,"this.layers.a.hidden"),new r(W,1)],["add","a",new r(W,1)],["set",new r(M,"this.layers.a.hidden"),new r(W,0)],["end"],["end"]],a.prototype=Object.create(t.prototype),a.prototype.constructor=a,i.prototype=Object.create(t.prototype),i.prototype.constructor=i,c.prototype=Object.create(t.prototype),c.prototype.constructor=c,h.prototype=Object.create(t.prototype),h.prototype.constructor=h,u.prototype=Object.create(t.prototype),u.prototype.constructor=u,l.prototype=Object.create(t.prototype),l.prototype.constructor=l,w.prototype=Object.create(t.prototype),w.prototype.constructor=w,p.prototype=Object.create(t.prototype),p.prototype.constructor=p,g.prototype=Object.create(t.prototype),g.prototype.constructor=g,y.prototype=Object.create(t.prototype),y.prototype.constructor=y,m.prototype=Object.create(t.prototype),m.prototype.constructor=m,b.prototype=Object.create(t.prototype),b.prototype.constructor=b,f.prototype=Object.create(t.prototype),f.prototype.constructor=f,d.prototype=Object.create(t.prototype),d.prototype.constructor=d,L.prototype=Object.create(t.prototype),L.prototype.constructor=L,v.prototype=Object.create(t.prototype),v.prototype.constructor=v,S.prototype=Object.create(t.prototype),S.prototype.constructor=S,H.prototype=Object.create(t.prototype),H.prototype.constructor=H,x.prototype=Object.create(t.prototype),x.prototype.constructor=x,T.prototype=Object.create(t.prototype),T.prototype.constructor=T;var I={},z={};I.transCommand=function(e,r){var s,n,o,a=r[0];switch(a){case"temp":n=r[1],o=t.execute(e,r[2]),z[n]=o,s="var "+n+"="+o+";\n";break;case"set":n=r[1],o=t.execute(e,r[2]),n in z&&(z[n]=o),s=n+"="+o+";\n";break;case"if":s="if";break;case"pred":var i=r[2],c=r[3];i in z||(i=t.execute(e,i)),c in z||(c=t.execute(e,c)),s="("+i+r[1]+c+"){\n";break;case"else":s="}else{\n";break;case"end":s="}\n";break;case"setTag":s='WidgetExecutor.setTag("'+e.tag+'",'+r[1]+")"}return s},I.transFunction=function(e,t){z={};for(var r="",s=0;s<t.length;s++)r+=this.transCommand(e,t[s]);return r},I.complier={},function(e){"use strict";function t(e){for(var r=[],s=!0;e.length&&s;){var n,o=e[0];switch(o[0]){case"if":n={},n.type="IF",n.args=[],e.shift(),n.args.push(e.shift()),n.args.push(t(e)),"else"===e[0][0]&&(e.shift(),n.args.push(t(e))),e.shift(),r.push(n);break;case"while":n={type:"WHILE",args:[]},e.shift(),n.args.push(e.shift()),n.args.push(t(e)),e.shift(),r.push(n);break;case"else":case"end":s=!1;break;default:r.push({type:"EXP",args:[o]}),e.shift()}}return r}function r(e,t){this.label=String(e),this.cmd=t}function s(e,t){u=0;var r=o(e,t);return n(r),r}function n(e){for(var t,r={},s=0;s<e.length;s++)t=e[s],""!==t.label&&(r[t.label]=s);for(s=0;s<e.length;s++){t=e[s];var n=t.cmd;if("jump"===n[0]){var o=r[n[2]];n[2]=o-s}}}function o(e,t){for(var s=[],n=0;n<e.length;n++){var o=e[n];switch(o.type){case"EXP":s.push(new r("",o.args[0]));break;case"IF":[].push.apply(s,a(o,t));break;case"WHILE":[].push.apply(s,i(o,t));break;default:s.push(new r("",o.args[0]))}}return s}function a(e,t){var s=[],n=e.args;2===n.length&&n.push([]);var a=n[0],i=n[2],c=n[1];if(t=t||!1){var h=a[0],y=l[h];y&&(a[0]=y,i=n[1],c=n[2])}s.push(new r("",a));var m=u;u+=1,s.push(new r("",[w,g,m])),[].push.apply(s,o(c,t));var b=u;u+=1,s.push(new r("",[w,g,b]));var f=o(i,t);return f.length>0?f[0].label=String(m):f.push(new r(m,[p,"",""])),[].push.apply(s,f),s.push(new r(b,[p,"",""])),s}function i(e,t){var s=[],n=e.args,a=n[0],i=n[1],c=u++,h=u++,y=u++;if(t){var m=l[a[0]];m?(a[0]=m,s.push(new r(c,a)),s.push(new r("",[w,g,h])),s.push(new r("",[w,g,y]))):(s.push(new r(c,a)),s.push(new r("",[w,g,y])),s.push(new r("",[w,g,h])))}var b=o(i,t);return b.push(new r("",[w,g,c])),b[0].label=String(h),[].push.apply(s,b),s.push(new r(y,[p,"",""])),s}var c={};c.parse=t;var h={},u=0,l={gte:"lt",lte:"gt"};h.trans=s;var w="jump",p="end",g="";e.parser=c,e.transformer=h}(I.complier);var D={};return D.models={},D.models.Button=n,D.models.ButtonGroup=o,D.models.Dashboard=a,D.models.RotateImg=i,D.models.TextArea=c,D.models.Progress=p,D.models.Switch=g,D.models.ScriptTrigger=h,D.models.Video=u,D.models.Slide=y,D.models.Num=l,D.models.SlideBlock=w,D.models.DateTime=b,D.models.TexNum=f,D.models.Selector=d,D.models.RotaryKnob=L,D.models.ColorPicker=v,D.models.DatePicker=S,D.models.TexDatePicker=H,D.models.TexTime=x,D.models.ColorBlock=T,D.models.Animation=m,D.Widget=t,D.WidgetCommandParser=I,D});